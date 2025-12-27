import { getWebSocketService } from '../websocket/server';

export const createNotification = async (
  userId: number,
  type: string,
  title: string,
  message: string,
  relatedEntityType?: string,
  relatedEntityId?: number
) => {
  try {
    const wsService = getWebSocketService();
    await wsService.sendNotification(userId, {
      type,
      title,
      message,
      related_entity_type: relatedEntityType,
      related_entity_id: relatedEntityId
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
