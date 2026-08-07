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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PollChart = ({ options }) => {
  const data = {
    labels: options.map(opt => opt.text),
    datasets: [
      {
        label: 'Votes',
        data: options.map(opt => opt.votes),
        backgroundColor: [
          'rgba(251, 113, 133, 0.85)', // Peach Pink
          'rgba(244, 114, 182, 0.85)', // Rose Pink
          'rgba(252, 165, 165, 0.85)', // Pastel Peach
          'rgba(192, 132, 252, 0.85)', // Soft Purple
          'rgba(245, 158, 11, 0.85)',  // Warm Gold
        ],
        borderColor: [
          '#fb7185',
          '#f472b6',
          '#fca5a5',
          '#c084fc',
          '#f59e0b',
        ],
        borderWidth: 1.5,
        borderRadius: 10,
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
        backgroundColor: '#3b0764',
        titleColor: '#fb7185',
        bodyColor: '#ffffff',
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        titleFont: { family: 'sans-serif', weight: 'bold' },
        bodyFont: { family: 'sans-serif' }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#f5d0fe',
          font: {
            family: 'sans-serif',
            weight: '600',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#f5d0fe',
          stepSize: 1,
          font: {
            family: 'sans-serif',
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
