'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Settings, User, Eye } from 'lucide-react';

export default function TestOrdersPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-amber-800 text-center mb-8">
                        訂單系統測試頁面
                    </h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Monitor 頁面 */}
                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                    <Eye className="w-5 h-5" />
                                    訂單監控頁面 (Monitor)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800">功能特色：</h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• 顯示用戶自己的訂單</li>
                                        <li>• 按時間排序（最新在上）</li>
                                        <li>• 自動刷新（30秒）</li>
                                        <li>• 顯示取貨資訊</li>
                                        <li>• 簡潔的用戶界面</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800">適用對象：</h3>
                                    <p className="text-sm text-gray-600">一般用戶追蹤自己的訂單狀態</p>
                                </div>
                                <Link href="/monitor">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                        <Package className="w-4 h-4 mr-2" />
                                        進入監控頁面
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Manager 頁面 */}
                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                                <CardTitle className="flex items-center gap-2 text-amber-800">
                                    <Settings className="w-5 h-5" />
                                    訂單管理頁面 (Manager)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800">功能特色：</h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• 顯示所有訂單</li>
                                        <li>• 按時間排序（最新在上）</li>
                                        <li>• 時間篩選（本日/本週/本月/本年）</li>
                                        <li>• 統計卡片顯示</li>
                                        <li>• 訂單狀態管理</li>
                                        <li>• 營收統計</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800">適用對象：</h3>
                                    <p className="text-sm text-gray-600">管理員管理所有訂單和查看統計</p>
                                </div>
                                <Link href="/manager">
                                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                                        <Settings className="w-4 h-4 mr-2" />
                                        進入管理頁面
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 功能對比表 */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="text-center text-gray-800">功能對比表</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-4">功能</th>
                                            <th className="text-center py-2 px-4 text-blue-700">Monitor 頁面</th>
                                            <th className="text-center py-2 px-4 text-amber-700">Manager 頁面</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <tr className="border-b">
                                            <td className="py-2 px-4 font-medium">訂單顯示</td>
                                            <td className="text-center py-2 px-4">僅自己的訂單</td>
                                            <td className="text-center py-2 px-4">所有訂單</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2 px-4 font-medium">時間排序</td>
                                            <td className="text-center py-2 px-4">✅ 最新在上</td>
                                            <td className="text-center py-2 px-4">✅ 最新在上</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2 px-4 font-medium">時間篩選</td>
                                            <td className="text-center py-2 px-4">❌</td>
                                            <td className="text-center py-2 px-4">✅ 本日/週/月/年</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2 px-4 font-medium">統計資訊</td>
                                            <td className="text-center py-2 px-4">❌</td>
                                            <td className="text-center py-2 px-4">✅ 訂單數量和營收</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2 px-4 font-medium">狀態管理</td>
                                            <td className="text-center py-2 px-4">❌ 僅查看</td>
                                            <td className="text-center py-2 px-4">✅ 可更新狀態</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2 px-4 font-medium">自動刷新</td>
                                            <td className="text-center py-2 px-4">✅ 30秒</td>
                                            <td className="text-center py-2 px-4">✅ 30秒</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-4 font-medium">權限要求</td>
                                            <td className="text-center py-2 px-4">一般用戶</td>
                                            <td className="text-center py-2 px-4">管理員</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            注意：Manager 頁面的管理員權限檢查目前是基於 email 的簡單判斷，
                            實際應用中應該使用更安全的權限驗證機制。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}