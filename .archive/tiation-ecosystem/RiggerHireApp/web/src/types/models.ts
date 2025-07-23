export interface User {
  id: string;
  name: string;
  email: string;
  profileImageURL?: string;
  skills: string[];
  certifications: Certification[];
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issueDate: Date;
  expiryDate?: Date;
  documentURL?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser?: User;
  isLoading: boolean;
}
