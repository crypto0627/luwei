export default function QuestionPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-amber-800 mb-8 text-center">
          常見問題
        </h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-amber-700 mb-3">
              如何訂購餐點？
            </h2>
            <p className="text-gray-600">
              您可以透過我們的網站或手機應用程式瀏覽菜單，選擇您喜愛的餐點並加入購物車。完成訂單後，我們會立即為您準備美味的餐點。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-amber-700 mb-3">
              外送範圍是哪裡？
            </h2>
            <p className="text-gray-600">
              我們目前提供台北市區的外送服務，詳細範圍請參考網站上的外送區域地圖。如果您不確定是否在服務範圍內，歡迎致電詢問。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-amber-700 mb-3">
              如何追蹤我的訂單？
            </h2>
            <p className="text-gray-600">
              訂單確認後，您可以在訂單頁面查看即時訂單狀態。我們也會透過簡訊或電子郵件通知您訂單的最新狀態。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-amber-700 mb-3">
              可以客製化餐點嗎？
            </h2>
            <p className="text-gray-600">
              是的，我們提供多種客製化選項，包括調整辣度、配料選擇等。在下單時，您可以在備註欄位註明您的特殊需求。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
