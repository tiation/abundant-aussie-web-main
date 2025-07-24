import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock user IDs
export const userOneId = new mongoose.Types.ObjectId();
export const userTwoId = new mongoose.Types.ObjectId();
export const teamOneId = new mongoose.Types.ObjectId();
export const teamTwoId = new mongoose.Types.ObjectId();

// Mock JWT tokens
const generateToken = (userId: string) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '7d',
  });
};

export const userOne = {
  _id: userOneId,
  name: 'Test Supervisor',
  email: 'supervisor@test.com',
  password: 'MyPass777!',
  role: 'supervisor',
  team: teamOneId,
  tokens: [generateToken(userOneId.toString())],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const userTwo = {
  _id: userTwoId,
  name: 'Test Agent',
  email: 'agent@test.com',
  password: 'MyPass777!',
  role: 'agent',
  team: teamTwoId,
  tokens: [generateToken(userTwoId.toString())],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const teamOne = {
  _id: teamOneId,
  name: 'Support Team Alpha',
  description: 'Primary customer support team',
  supervisor: userOneId,
  members: [userOneId],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const teamTwo = {
  _id: teamTwoId,
  name: 'Sales Team Beta',
  description: 'Primary sales team',
  supervisor: userTwoId,
  members: [userTwoId],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const callOne = {
  _id: new mongoose.Types.ObjectId(),
  agentId: userOneId,
  teamId: teamOneId,
  callerId: '+1234567890',
  duration: 300,
  status: 'completed',
  resolution: 'resolved',
  satisfactionScore: 4,
  createdAt: new Date('2024-01-15T10:00:00.000Z'),
  updatedAt: new Date('2024-01-15T10:05:00.000Z'),
};

export const callTwo = {
  _id: new mongoose.Types.ObjectId(),
  agentId: userTwoId,
  teamId: teamTwoId,
  callerId: '+0987654321',
  duration: 180,
  status: 'completed',
  resolution: 'escalated',
  satisfactionScore: 3,
  createdAt: new Date('2024-01-15T11:00:00.000Z'),
  updatedAt: new Date('2024-01-15T11:03:00.000Z'),
};

export const scheduleOne = {
  _id: new mongoose.Types.ObjectId(),
  agentId: userOneId,
  date: '2024-01-15',
  startTime: '09:00',
  endTime: '17:00',
  breakTimes: ['12:00-13:00', '15:00-15:15'],
  status: 'scheduled',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Setup database with test data
export const setupDatabase = async () => {
  // Clear existing data
  await mongoose.connection.db?.dropDatabase();

  // Hash passwords
  const saltRounds = 10;
  userOne.password = await bcrypt.hash(userOne.password, saltRounds);
  userTwo.password = await bcrypt.hash(userTwo.password, saltRounds);

  // Insert test data (this would normally use your actual models)
  // For now, we'll assume the models exist and use them
  
  // Note: In a real implementation, you would import your models and use them:
  // const User = require('../../models/User');
  // const Team = require('../../models/Team');
  // const Call = require('../../models/Call');
  // const Schedule = require('../../models/Schedule');
  
  // await new User(userOne).save();
  // await new User(userTwo).save();
  // await new Team(teamOne).save();
  // await new Team(teamTwo).save();
  // await new Call(callOne).save();
  // await new Call(callTwo).save();
  // await new Schedule(scheduleOne).save();
  
  console.log('Test database setup completed');
};

// Clean up database
export const cleanupDatabase = async () => {
  await mongoose.connection.db?.dropDatabase();
};
