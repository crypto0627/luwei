import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-amber-50 via-orange-50 to-white pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-amber-800 text-center mb-12">
            我們的滷味故事
          </h1>

          <div className="flex justify-center mb-12">
            <div className="relative w-80 h-48 md:w-[420px] md:h-64 rounded-2xl overflow-hidden shadow-lg border-amber-200 border bg-white">
              <Image
                src="/images/business-card.webp"
                alt="大竹小倆口滷味名片"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-12">
            {/* 創始故事 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h2 className="text-2xl font-semibold text-amber-700 mb-4">
                郭爸爸與郭媽媽的創業故事
              </h2>
              <p className="text-amber-600 leading-relaxed">
                新鮮市場廚房的滷味故事始於2025年，由郭爸爸和郭媽媽在桃園蘆竹區大竹攜手創立。郭爸爸憑藉著從父親那裡學來的獨門滷汁配方，與郭媽媽一起在廚房專研配方，清晨4點就開始準備食材，只為讓街坊鄰居能吃到最新鮮、最入味的滷味。
              </p>
            </div>

            {/* 特色介紹 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h2 className="text-2xl font-semibold text-amber-700 mb-4">
                夫妻同心，追求完美
              </h2>
              <div className="space-y-4">
                <p className="text-amber-600 leading-relaxed">
                  郭爸爸負責滷汁的調配，郭媽媽則專注於食材的挑選和處理。我們的滷汁配方融合了多種中藥材和香料，經過8小時以上的慢火熬煮，才能成就這獨特的風味。每一鍋滷汁都蘊含著這對夫妻對美食的堅持與熱情。
                </p>
                <p className="text-amber-600 leading-relaxed">
                  在保持傳統風味的同時，郭媽媽也不斷創新，開發出多種特色口味，如麻辣、蒜香、五香等，讓顧客能品嚐到不同風味的滷味。
                </p>
              </div>
            </div>

            {/* 品質承諾 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h2 className="text-2xl font-semibold text-amber-700 mb-4">
                嚴選食材，品質保證
              </h2>
              <div className="space-y-4">
                <p className="text-amber-600 leading-relaxed">
                  郭媽媽堅持每天清晨親自到市場挑選新鮮食材，從雞翅、雞爪、鳥蛋、豆干，每一樣食材都經過嚴格把關。郭爸爸則負責確保每一份滷味都能呈現最佳風味。
                </p>
                <p className="text-amber-600 leading-relaxed">
                  為了讓顧客吃得安心，這對夫妻採用現代化的食品衛生管理系統，確保從食材採購到成品出爐的每個環節都符合最高標準。
                </p>
              </div>
            </div>

            {/* 未來展望 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100">
              <h2 className="text-2xl font-semibold text-amber-700 mb-4">
                傳承美味，永續經營
              </h2>
              <p className="text-amber-600 leading-relaxed">
                郭爸爸和郭媽媽始終秉持著「用心做好每一份滷味」的理念，希望將這份美味傳承下去。未來，他們將繼續堅持品質，創新口味，讓更多人能品嚐到這份來自台灣的傳統美味。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
