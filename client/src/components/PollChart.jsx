import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register necessary Chart.js elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PollChart = ({ options }) => {
  const data = {
    labels: options.map(opt => opt.text),
    datasets: [
      {
        label: 'Votes',
        data: options.map(opt => opt.votes),
        backgroundColor: [
          'rgba(99, 102, 241, 0.75)',  // Indigo
          'rgba(16, 185, 129, 0.75)', // Emerald
          'rgba(245, 158, 11, 0.75)', // Amber
          'rgba(239, 68, 68, 0.75)',  // Red
          'rgba(139, 92, 246, 0.75)', // Violet
        ],
        borderColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
        ],
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        padding: 12,
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter, sans-serif',
            weight: '500',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.05)',
        },
        ticks: {
          color: '#94a3b8',
          stepSize: 1,
          font: {
            family: 'Inter, sans-serif',
          },
        },
      },
    },
  };

  return (
    <div className="h-64 sm:h-80 relative w-full">
      <Bar data={data} options={chartOptions} />
    </div>
  );
};

export default PollChart;
