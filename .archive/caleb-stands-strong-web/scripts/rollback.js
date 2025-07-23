#!/usr/bin/env node

// Rollback management script for Vercel
const { deploymentManager } = require('../src/utils/deployment');

(async () => {
  try {
    const deploymentHistory = await deploymentManager.getDeploymentHistory(3);
    console.log('Recent Deployments:');
    console.table(deploymentHistory.map(dep => ({
      id: dep.id,
      version: dep.version,
      status: dep.status,
      timestamp: new Date(dep.timestamp).toLocaleString(),
      branch: dep.branch,
      commit: dep.commit,
      url: dep.url
    })));

    if (deploymentHistory.length > 1) {
      const previousDeployment = deploymentHistory[1];
      console.log(`
Rolling back to previous deployment: ${previousDeployment.id}`);
      const success = await deploymentManager.rollbackToDeployment(previousDeployment.id, 'Manual rollback script execution');
      
      if (success) {
        console.log('Rollback successful. Please verify the deployment manually.');
      } else {
        throw new Error('Rollback failed. Please check the logs and try again.');
      }
    } else {
      console.log('No previous deployment found to rollback to.');
    }
  } catch (error) {
    console.error('Rollback script encountered an error:', error);
    process.exit(1);
  }
})();

