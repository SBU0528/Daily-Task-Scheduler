import "dotenv/config";

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { OpenAI } from 'openai';

admin.initializeApp();

const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

export const getTasks = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  try {
    const tasksSnapshot = await admin
      .firestore()
      .collection('tasks')
      .where('userId', '==', context.auth.uid)
      .orderBy('dueDate', 'asc')
      .get();

    const tasks = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { tasks };
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get tasks');
  }
});

export const createTask = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { title, description, dueDate, priority } = data;

  if (!title || !dueDate || !priority) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  try {
    const taskRef = await admin.firestore().collection('tasks').add({
      title,
      description: description || '',
      dueDate: admin.firestore.Timestamp.fromDate(new Date(dueDate)),
      priority,
      completed: false,
      userId: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { id: taskRef.id };
  } catch (error) {
    console.error('Error creating task:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create task');
  }
});

export const updateTask = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { taskId, updates } = data;

  if (!taskId) {
    throw new functions.https.HttpsError('invalid-argument', 'Task ID is required');
  }

  try {
    const taskRef = admin.firestore().collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Task not found');
    }

    const taskData = taskDoc.data();
    if (taskData?.userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    await taskRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating task:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update task');
  }
});

export const deleteTask = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { taskId } = data;

  if (!taskId) {
    throw new functions.https.HttpsError('invalid-argument', 'Task ID is required');
  }

  try {
    const taskRef = admin.firestore().collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Task not found');
    }

    const taskData = taskDoc.data();
    if (taskData?.userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Access denied');
    }

    await taskRef.delete();

    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete task');
  }
});

export const getAISuggestion = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  try {
    const tasksSnapshot = await admin
      .firestore()
      .collection('tasks')
      .where('userId', '==', context.auth.uid)
      .where('completed', '==', false)
      .get();

    const tasks = tasksSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        title: data.title,
        priority: data.priority,
        dueDate: data.dueDate.toDate().toISOString().split('T')[0],
      };
    });

    if (tasks.length === 0) {
      return {
        suggestion: 'Great job! All your tasks are complete.',
        reasoning: 'Consider planning new tasks or take a well-deserved break.',
      };
    }

    const prompt = `Based on these tasks, what should I focus on today? Please provide a specific recommendation and brief reasoning.

Tasks:
${JSON.stringify(tasks, null, 2)}

Please respond in this exact JSON format:
{
  "suggestion": "Your specific recommendation here",
  "reasoning": "Brief explanation of why this is the best focus"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No suggestion received from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    
    // Fallback suggestion
    return {
      suggestion: 'Focus on your highest priority tasks first',
      reasoning: 'Prioritizing important tasks ensures maximum productivity.',
    };
  }
});