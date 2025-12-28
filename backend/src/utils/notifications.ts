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

export const notificationTypes = {
  SHOP_DRAWING_CREATED: 'shop_drawing_created',
  SHOP_DRAWING_UPDATED: 'shop_drawing_updated',
  SHOP_DRAWING_APPROVED: 'shop_drawing_approved',
  RFI_CREATED: 'rfi_created',
  RFI_UPDATED: 'rfi_updated',
  RFI_RESPONDED: 'rfi_responded',
  MEETING_CREATED: 'meeting_created',
  MEETING_UPDATED: 'meeting_updated',
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  COMMENT_ADDED: 'comment_added',
};
