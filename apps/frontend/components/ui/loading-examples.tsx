// 這個文件展示了如何使用新的 Loading 組件
// 請勿在生產環境中使用此文件

import { useState } from 'react';
import { PageLoading, ButtonLoading, LoadingSpinner } from './loading';

export function LoadingExamples() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAsyncAction = async () => {
    setIsLoading(true);
    // 模擬 API 調用
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-amber-800">Loading 組件使用範例</h1>
      
      {/* 基礎 LoadingSpinner */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-amber-700">1. LoadingSpinner 基礎組件</h2>
        <div className="flex items-center gap-4">
          <LoadingSpinner size="xs" />
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
          <LoadingSpinner size="xl" />
        </div>
        <div className="flex items-center gap-4">
          <LoadingSpinner color="amber" />
          <LoadingSpinner color="blue" />
          <LoadingSpinner color="gray" />
          <div className="bg-gray-800 p-2 rounded">
            <LoadingSpinner color="white" />
          </div>
        </div>
      </section>

      {/* PageLoading */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-amber-700">2. PageLoading 頁面載入</h2>
        <div className="border border-amber-200 rounded-lg h-64">
          <PageLoading message="載入頁面中..." />
        </div>
        <div className="border border-amber-200 rounded-lg h-32">
          <PageLoading message="載入資料中..." size="sm" />
        </div>
      </section>

      {/* ButtonLoading */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-amber-700">3. ButtonLoading 按鈕載入</h2>
        <div className="flex flex-wrap gap-4">
          <ButtonLoading
            loading={isLoading}
            loadingText="處理中..."
            onClick={handleAsyncAction}
          >
            預設按鈕
          </ButtonLoading>
          
          <ButtonLoading
            loading={isLoading}
            loadingText="送出中..."
            onClick={handleAsyncAction}
            variant="outline"
          >
            外框按鈕
          </ButtonLoading>
          
          <ButtonLoading
            loading={isLoading}
            loadingText="儲存中..."
            onClick={handleAsyncAction}
            variant="ghost"
          >
            透明按鈕
          </ButtonLoading>
          
          <ButtonLoading
            loading={isLoading}
            loadingText="上傳中..."
            onClick={handleAsyncAction}
            size="sm"
          >
            小按鈕
          </ButtonLoading>
          
          <ButtonLoading
            loading={isLoading}
            loadingText="提交中..."
            onClick={handleAsyncAction}
            size="lg"
          >
            大按鈕
          </ButtonLoading>
        </div>
      </section>

      {/* 實際使用場景 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-amber-700">4. 實際使用場景</h2>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">表單提交</h3>
          <form className="space-y-4">
            <input 
              type="text" 
              placeholder="輸入內容..." 
              className="w-full p-2 border border-amber-300 rounded"
            />
            <ButtonLoading
              type="submit"
              loading={isLoading}
              loadingText="提交中..."
              onClick={(e) => {
                e.preventDefault();
                handleAsyncAction();
              }}
            >
              提交表單
            </ButtonLoading>
          </form>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">資料載入</h3>
          {isLoading ? (
            <PageLoading message="載入資料中..." size="sm" />
          ) : (
            <div className="text-gray-600">資料載入完成</div>
          )}
        </div>
      </section>
    </div>
  );
}