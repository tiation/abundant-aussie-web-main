import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Storage } from '@capacitor/storage';
import { supabase } from './supabase';

export interface RiggerNotification {
  id: string;
  title: string;
  body: string;
  type: 'job_match' | 'application_update' | 'message' | 'system' | 'safety_alert';
  data?: any;
  isRead: boolean;
  timestamp: number;
}

export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  static async initialize(): Promise<void> {
    const service = NotificationService.getInstance();
    if (service.isInitialized) return;

    try {
      // Request permission
      const permissionStatus = await PushNotifications.requestPermissions();
      
      if (permissionStatus.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register();
        
        // Set up listeners
        service.setupListeners();
        
        service.isInitialized = true;
        console.log('NotificationService initialized successfully');
      } else {
        console.warn('Push notification permission denied');
      }
    } catch (error) {
      console.error('Failed to initialize NotificationService:', error);
    }
  }

  private setupListeners(): void {
    // On successful registration
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      
      // Store token locally
      await Storage.set({
        key: 'push_token',
        value: token.value
      });

      // Send token to your backend
      await this.registerTokenWithBackend(token.value);
    });

    // Registration error
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Push registration error: ', error);
    });

    // Show notifications received in foreground
    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
      console.log('Push notification received: ', notification);
      
      // Provide haptic feedback
      await Haptics.impact({ style: ImpactStyle.Medium });
      
      // Store notification locally
      await this.storeNotificationLocally(notification);
      
      // Handle different notification types
      await this.handleNotification(notification);
    });

    // Handle notification tapped
    PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
      console.log('Push notification action performed: ', notification);
      
      // Handle navigation based on notification type
      await this.handleNotificationAction(notification);
    });
  }

  private async registerTokenWithBackend(token: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update user's push token in the database
        await supabase
          .from('user_profiles')
          .update({ 
            push_token: token,
            push_notifications_enabled: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        
        console.log('Push token registered with backend');
      }
    } catch (error) {
      console.error('Failed to register token with backend:', error);
    }
  }

  private async storeNotificationLocally(notification: PushNotificationSchema): Promise<void> {
    try {
      const storedNotification: RiggerNotification = {
        id: notification.id || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: notification.title || 'RiggerConnect',
        body: notification.body || '',
        type: (notification.data?.type as any) || 'system',
        data: notification.data,
        isRead: false,
        timestamp: Date.now()
      };

      // Get existing notifications
      const existingData = await Storage.get({ key: 'local_notifications' });
      const notifications: RiggerNotification[] = existingData.value 
        ? JSON.parse(existingData.value) 
        : [];

      // Add new notification to the beginning
      notifications.unshift(storedNotification);

      // Keep only the latest 100 notifications
      const trimmedNotifications = notifications.slice(0, 100);

      // Store updated notifications
      await Storage.set({
        key: 'local_notifications',
        value: JSON.stringify(trimmedNotifications)
      });

    } catch (error) {
      console.error('Failed to store notification locally:', error);
    }
  }

  private async handleNotification(notification: PushNotificationSchema): Promise<void> {
    const type = notification.data?.type;

    switch (type) {
      case 'job_match':
        // Show in-app notification for new job matches
        this.showInAppNotification('New Job Match!', notification.body || 'A job matching your skills is available');
        break;
      
      case 'application_update':
        // Handle application status updates
        this.showInAppNotification('Application Update', notification.body || 'Your job application status has changed');
        break;
      
      case 'safety_alert':
        // Critical safety alerts get strong haptic feedback
        await Haptics.impact({ style: ImpactStyle.Heavy });
        this.showInAppNotification('⚠️ Safety Alert', notification.body || 'Important safety information');
        break;
      
      default:
        // Standard notification
        this.showInAppNotification(notification.title || 'RiggerConnect', notification.body);
    }
  }

  private async handleNotificationAction(action: ActionPerformed): Promise<void> {
    const notification = action.notification;
    const type = notification.data?.type;

    // Mark notification as read
    await this.markNotificationAsRead(notification.id);

    // Navigate based on notification type
    switch (type) {
      case 'job_match':
        // Navigate to job details
        const jobId = notification.data?.jobId;
        if (jobId) {
          window.location.href = `/jobs/${jobId}`;
        } else {
          window.location.href = '/jobs';
        }
        break;
      
      case 'application_update':
        // Navigate to applications
        window.location.href = '/profile/applications';
        break;
      
      case 'message':
        // Navigate to messages
        const chatId = notification.data?.chatId;
        if (chatId) {
          window.location.href = `/messages/${chatId}`;
        } else {
          window.location.href = '/messages';
        }
        break;
      
      case 'safety_alert':
        // Navigate to safety information
        window.location.href = '/safety';
        break;
      
      default:
        // Navigate to notifications
        window.location.href = '/notifications';
    }
  }

  private showInAppNotification(title: string, body?: string): void {
    // Create a simple in-app notification
    // You could use a more sophisticated toast library here
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="font-semibold">${title}</div>
      ${body ? `<div class="text-sm opacity-90 mt-1">${body}</div>` : ''}
    `;

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  /**
   * Get all locally stored notifications
   */
  static async getLocalNotifications(): Promise<RiggerNotification[]> {
    try {
      const data = await Storage.get({ key: 'local_notifications' });
      return data.value ? JSON.parse(data.value) : [];
    } catch (error) {
      console.error('Failed to get local notifications:', error);
      return [];
    }
  }

  /**
   * Mark a notification as read
   */
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await NotificationService.getLocalNotifications();
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      );

      await Storage.set({
        key: 'local_notifications',
        value: JSON.stringify(updatedNotifications)
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Clear all notifications
   */
  static async clearNotifications(): Promise<void> {
    try {
      await Storage.remove({ key: 'local_notifications' });
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const notifications = await NotificationService.getLocalNotifications();
      return notifications.filter(n => !n.isRead).length;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Send a local notification (for testing)
   */
  static async sendLocalNotification(title: string, body: string, type: RiggerNotification['type'] = 'system'): Promise<void> {
    const notification: PushNotificationSchema = {
      id: `local_${Date.now()}`,
      title,
      body,
      data: { type }
    };

    const service = NotificationService.getInstance();
    await service.storeNotificationLocally(notification);
    await service.handleNotification(notification);
  }
}

export default NotificationService;
