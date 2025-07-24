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
              您可以透過我們的網站或手機將網站加入至桌面應用程式並瀏覽菜單，選擇您喜愛的餐點並加入購物車。完成訂單後，我們會立即為您準備美味的滷味。
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-amber-700 mb-3">
              外送範圍是哪裡？
            </h2>
            <p className="text-gray-600">
              我們目前無提供外送服務，敬請期待。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-amber-700 mb-3">
              如何追蹤我的訂單？
            </h2>
            <p className="text-gray-600">
              訂單確認後，您可以在首頁點選訂單頁面查看即時訂單狀態。我們也會透過電子郵件通知您訂單的最新狀態。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-amber-700 mb-3">
              下單後，多久可以取餐？
            </h2>
            <p className="text-gray-600">
              若您訂餐時間在週一到週五，那麼我們會在隔週的週一用Mail通知您的訂單已完成，您只需要到店取貨並付款即可。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
