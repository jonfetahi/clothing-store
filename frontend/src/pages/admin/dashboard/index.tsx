import React, { useState, useEffect } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useServices from '../../../hooks/use-service';
import { Services } from '../../../api/services';
import { DashboardRecentOrder, DashboardSummary, DashboardTopProduct } from './types';
import moment from 'moment';
import { Container } from '../../../shared/ui/Container';
import { useBreadcrumbs } from '../../../context/navigation-context';
import { PAYMENT_METHODS, VIEW_TYPE } from '../../../config/constants';


const formatCurrency = (value: number) =>
  `$${Number(value ?? 0).toFixed(2)}`;

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

export function Dashboard() {
  const [period, setPeriod] = useState<string>(
    VIEW_TYPE.MONTHLY
  );
  useBreadcrumbs('Dashboard', 2)
  const {
    loading: summaryLoading,
    data: summaryData,
    error: summaryError,
  } = useServices(Services.Dashboard.summary, true);

  const {
    data: earnings,
    requestAsync: getEarnings,
    loading: earningsLoading,
    error: earningsError,
  } = useServices(Services.Dashboard.earnings, false);

  const {
    data: dataProducts,
    loading: productsLoading,
    error: productsError,
  } = useServices(Services.Dashboard.topSelling, true);

  const {
    data: dataOrders,
    loading: ordersLoading,
    error: ordersError,
  } = useServices(Services.Dashboard.recentOrders, true);

  useEffect(() => {
    getEarnings({ period });
  }, [period]);

  //@ts-ignore
  const summary = summaryData as DashboardSummary ?? null;
  //@ts-ignore
  const topProducts = dataProducts as DashboardTopProduct[] ?? [];
  //@ts-ignore
  const recentOrders = dataOrders as DashboardRecentOrder[] ?? [];

  const statistics = [
    {
      label: "Total Revenue",
      value: formatCurrency(summary?.total_revenue),
    },
    {
      label: "Total Orders",
      value: summary?.total_orders ?? 0,
    },
    {
      label: "Total Products",
      value: summary?.total_products ?? 0,
    },
    {
      label: "Total Customers",
      value: summary?.total_customers ?? 0,
    },
    {
      label: "Pending Orders",
      value: summary?.pending_orders ?? 0,
    },
    {
      label: "Low Stock Variants",
      value: summary?.low_stock_variants ?? 0,
    },
  ];

  const orderStatuses = [
    {
      name: "Confirmed",
      value: summary?.confirmed_orders ?? 0,
      color: "#16a34a",
    },
    {
      name: "Pending",
      value: summary?.pending_orders ?? 0,
      color: "#eab308",
    },
    {
      name: "Cancelled",
      value: summary?.cancelled_orders ?? 0,
      color: "#ef4444",
    },
  ];

  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor your store's performance and recent activity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {statistics.map((statistic) => (
            <div
              key={statistic.label}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <p className="text-sm text-gray-500">
                {statistic.label}
              </p>

              <h2 className="text-2xl font-semibold text-primary mt-3">
                {summaryLoading
                  ? '...'
                  : summaryError || !summary
                    ? '—'
                    : statistic.value}
              </h2>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-semibold text-primary">
                  Sales Revenue
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {period === VIEW_TYPE.DAILY
                    ? 'Last 30 days'
                    : 'Last 12 months'}
                </p>
              </div>
              <div className="flex bg-gray-100 rounded-md p-1">
                {([VIEW_TYPE.DAILY, VIEW_TYPE.MONTHLY] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setPeriod(item)}
                    className={`px-4 py-2 text-xs rounded-md
                    font-medium capitalize ${
                      period === item
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-gray-500'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-72">
              {earningsLoading ? (
                <p className="text-sm text-gray-500 text-center py-20">
                  Loading earnings...
                </p>
              ) : earningsError ? (
                <p className="text-sm text-red-500 text-center py-20">
                  Failed to retrieve earnings.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earnings ?? []}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />

                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={20}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => `€${value}`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value) =>
                        [formatCurrency(Number(value)), 'Revenue']
                      }
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#334155"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold text-primary">
              Order Status
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Distribution of all orders
            </p>

            {summaryLoading ? (
              <p className="text-sm text-gray-500 text-center py-16">
                Loading...
              </p>
            ) : summaryError ? (
              <p className="text-sm text-red-500 text-center py-16">
                Failed to retrieve order statistics.
              </p>
            ) : (
              <>
                <div className="h-52 relative">
                  {summary?.total_orders > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatuses}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {orderStatuses.map((status) => (
                            <Cell
                              key={status.name}
                              fill={status.color}
                            />
                          ))}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full border-[22px] border-gray-100" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-semibold">
                    {summary?.total_orders ?? 0}
                  </span>
                    <span className="text-xs text-gray-500">
                    Total Orders
                  </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {orderStatuses.map((status) => (
                    <div
                      key={status.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />

                        <span className="text-sm text-gray-600">
                        {status.name}
                      </span>
                      </div>

                      <span className="text-sm font-semibold">
                      {status.value}
                    </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-primary">
              Top-Selling Products
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Best-performing products based on confirmed sales.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Rank</th>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Units Sold</th>
                <th className="px-5 py-3 font-medium text-right">
                  Revenue
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
              {topProducts?.map((product: any, index: number) => (
                <tr key={product.product_id}>
                  <td className="px-5 py-4 text-gray-500">
                    #{index + 1}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-12 rounded-md object-cover"
                        />
                      )}
                      <span className="font-medium text-primary">
                      {product.name}
                    </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {product.total_sold}
                  </td>
                  <td className="px-5 py-4 text-right font-medium">
                    {formatCurrency(product.total_revenue)}
                  </td>
                </tr>
              ))}
              {topProducts?.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-gray-500"
                  >
                    {productsLoading
                      ? 'Loading products...'
                      : productsError
                        ? 'Failed to retrieve products.'
                        : 'No confirmed sales yet.'}
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-primary">
              Recent Orders
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Latest orders placed by customers.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                {[
                  'Order ID',
                  'Customer',
                  'Date',
                  'Items',
                  'Payment',
                  'Status',
                  'Amount',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 font-medium whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
              {recentOrders?.map((order: any) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {order.first_name} {order.last_name}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-gray-500">
                    {moment.utc(order.created_at).format('DD/MM/YYYY')}
                  </td>

                  <td className="px-5 py-4">
                    {order.total_items}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    {order.payment_method === PAYMENT_METHODS.CARD
                      ? 'Card'
                      : order.payment_method === PAYMENT_METHODS.CASH_ON_DELIVERY
                        ? 'Cash on Delivery'
                        : '—'}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full
                        text-xs font-medium ${
                        statusStyles[order.status] ??
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {formatCurrency(order.total_amount)}
                  </td>

                </tr>
              ))}

              {recentOrders?.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-gray-500"
                  >
                    {ordersLoading
                      ? 'Loading orders...'
                      : ordersError
                        ? 'Failed to retrieve orders.'
                        : 'No orders found.'}
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
}