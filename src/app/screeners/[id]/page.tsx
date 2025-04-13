'use client';

import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { screeners, analytics } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ScreenerPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [backtestParams, setBacktestParams] = useState({
    startDate: '',
    endDate: '',
  });

  const { data: screener, isLoading: screenerLoading } = useQuery({
    queryKey: ['screener', params.id],
    queryFn: () => screeners.get(params.id).then((res) => res.data),
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics', params.id],
    queryFn: () => analytics.getScreenerAnalytics(params.id).then((res) => res.data),
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleBacktest = async () => {
    try {
      await screeners.backtest(params.id, backtestParams);
      // Refresh analytics data
      // You might want to use a mutation here instead
    } catch (error) {
      console.error('Backtest failed:', error);
    }
  };

  if (loading || screenerLoading || analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">Stocksift</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{screener?.name}</h2>
            <p className="text-gray-600 mb-6">{screener?.description}</p>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Backtest</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={backtestParams.startDate}
                    onChange={(e) =>
                      setBacktestParams({
                        ...backtestParams,
                        startDate: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={backtestParams.endDate}
                    onChange={(e) =>
                      setBacktestParams({
                        ...backtestParams,
                        endDate: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleBacktest}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Run Backtest
              </button>
            </div>

            <div className="h-96">
              <h3 className="text-lg font-medium mb-4">Performance</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analyticsData?.performance}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 