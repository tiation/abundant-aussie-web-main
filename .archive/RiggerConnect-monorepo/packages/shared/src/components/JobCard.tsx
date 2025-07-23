import * as React from 'react';
import { Job, JobType, Priority } from '../types/core';
import { formatCurrency, formatDate, formatDuration } from '../utils/formatters';
import { cn } from '../utils/cn';

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
  className?: string;
  showApplicantCount?: boolean;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const jobTypeColors = {
  rigging: 'bg-blue-100 text-blue-800',
  lighting: 'bg-purple-100 text-purple-800',
  sound: 'bg-indigo-100 text-indigo-800',
  video: 'bg-pink-100 text-pink-800',
  staging: 'bg-gray-100 text-gray-800',
  trucking: 'bg-green-100 text-green-800',
  crew_chief: 'bg-red-100 text-red-800',
  technical_direction: 'bg-orange-100 text-orange-800',
  equipment_rental: 'bg-teal-100 text-teal-800',
  consultation: 'bg-cyan-100 text-cyan-800',
};

/**
 * A card component for displaying job information
 */
export const JobCard: React.FC<JobCardProps> = ({
  job,
  onClick,
  className,
  showApplicantCount = true,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(job);
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200',
        onClick && 'cursor-pointer hover:border-gray-300',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={cn(
                'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                jobTypeColors[job.type as keyof typeof jobTypeColors] || 'bg-gray-100 text-gray-800'
              )}
            >
              {job.type.replace('_', ' ').toUpperCase()}
            </span>
            <span
              className={cn(
                'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                priorityColors[job.priority]
              )}
            >
              {job.priority.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {job.budget.type === 'hourly' && '$'}
            {formatCurrency(job.budget.amount, job.budget.currency)}
            {job.budget.type === 'hourly' && '/hr'}
          </div>
          {job.budget.negotiable && (
            <div className="text-xs text-gray-500">Negotiable</div>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location.city}, {job.location.state}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {formatDuration(job.timeline.duration)}
          </div>
        </div>
        <div className="text-right">
          <div>Posted {formatDate(job.createdAt, 'relative')}</div>
          {showApplicantCount && (
            <div className="text-xs">
              {job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

JobCard.displayName = 'JobCard';
