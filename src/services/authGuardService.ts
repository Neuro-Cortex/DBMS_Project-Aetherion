// src/services/authGuardService.ts
export class AuthGuardService {
  // Check if action requires login
  static requiresAuth(action: 'book_appointment' | 'order_medicine' | 'contact_doctor' | 'emergency_contact'): boolean {
    const actionsRequiringAuth = ['book_appointment', 'order_medicine', 'contact_doctor'];
    return actionsRequiringAuth.includes(action);
  }

  // Show login modal/prompt
  static showLoginPrompt(action: string, returnUrl: string) {
    // Store the intended action and return URL
    sessionStorage.setItem('intendedAction', action);
    sessionStorage.setItem('returnUrl', returnUrl);
    
    // Show toast notification
    const event = new CustomEvent('showLoginPrompt', {
      detail: {
        message: `Please login to ${action.replace('_', ' ')}`,
        action: action,
        returnUrl: returnUrl
      }
    });
    window.dispatchEvent(event);
    
    return false;
  }

  // Get intended action after login
  static getIntendedAction() {
    return {
      action: sessionStorage.getItem('intendedAction'),
      returnUrl: sessionStorage.getItem('returnUrl')
    };
  }

  // Clear intended action
  static clearIntendedAction() {
    sessionStorage.removeItem('intendedAction');
    sessionStorage.removeItem('returnUrl');
  }
}