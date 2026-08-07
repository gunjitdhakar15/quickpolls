import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const PollChart = ({ options }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = {
    labels: options.map(opt => opt.text),
    datasets: [
      {
        label: 'Votes',
        data: options.map(opt => opt.votes),
        backgroundColor: [
          isDark ? '#818cf8' : '#4f46e5', // Indigo
          isDark ? '#38bdf8' : '#0284c7', // Cyan
          isDark ? '#34d399' : '#059669', // Emerald
          isDark ? '#fbbf24' : '#d97706', // Amber
          isDark ? '#f472b6' : '#db2777', // Pink
          isDark ? '#a78bfa' : '#7c3aed', // Purple
        ],
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? '#0f172a' : '#ffffff',
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDark ? '#cbd5e1' : '#334155',
          font: {
            family: 'Inter, sans-serif',
            size: 11,
            weight: '500',
          },
          boxWidth: 12,
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return ` ${label}: ${value} votes (${percentage}%)`;
          }
        }
      },
    },
    cutout: '65%',
  };

  return (
    <div className="h-48 sm:h-56 relative w-full flex items-center justify-center">
      <Doughnut data={data} options={chartOptions} />
    </div>
  );
};

export default PollChart;
