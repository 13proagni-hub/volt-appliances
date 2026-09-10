import React, { useState } from 'react';
import { initialStats, initialOrders } from '../data/adminStore';
import { BarChart3, Package, ShoppingBag, Users, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState(initialOrders);

  const toggleOrderStatus = (id) => {
    setOrders(orders.map(order => 
      order.id === id 
        ? { ...order, status: order.status === 'Pending' ? 'Delivered' : 'Pending' } 
        : order
    ));
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 p-6 border-r border-slate-800">
        <h2 className="text-xl font-bold tracking-wider text-indigo-400 mb-8">VOLT ADMIN</h2>
        <nav className="space-y-4">
          <a href="#overview" className="flex items-center gap-3 text-indigo-400 font-medium"><BarChart3 size={20}/> Overview</a>
          <a href="#products" className="flex items-center gap-3 text-slate-400 hover:text-slate-200"><Package size={20}/> Products</a>
          <a href="#orders" className="flex items-center gap-3 text-slate-400 hover:text-slate-200"><ShoppingBag size={20}/> Orders</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard Analytics</h1>
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold">Demo Mode</span>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold text-white mt-1">{initialStats.totalRevenue}</h3>
          </div>
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm">Total Orders</p>
            <h3 className="text-2xl font-bold text-white mt-1">{initialStats.totalOrders}</h3>
          </div>
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm">Active Products</p>
            <h3 className="text-2xl font-bold text-white mt-1">{initialStats.activeProducts}</h3>
          </div>
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm">Conversion Rate</p>
            <h3 className="text-2xl font-bold text-white mt-1">{initialStats.conversionRate}</h3>
          </div>
        </div>

        {/* Interactive Orders Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-sm">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {orders.map(order => (
                <tr key={order.id} className="text-sm">
                  <td className="py-4 font-mono text-indigo-300">{order.id}</td>
                  <td className="py-4">{order.customer}</td>
                  <td className="py-4">{order.amount}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {order.status === 'Delivered' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => toggleOrderStatus(order.id)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}