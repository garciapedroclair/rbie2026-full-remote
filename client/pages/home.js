import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const cards = [
    {
      title: 'Chat Messages',
      description: 'Talk to the LLM and exchange messages.',
      route: '/message',
    },
    {
      title: 'LLM for User Stories',
      description: 'Dashboard for FSE education 2026 paper.',
      route: '/llm_us',
    },
    {
      title: 'Fully Remote Education.',
      description: 'Dashboard about Student Performance for RBIE 2025',
      route: '/full_remote',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl bg-white p-6 rounded-xl border-2 shadow-xl relative">        
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">
          Portifolio
        </h1>

        <button
          className="absolute top-6 right-6 text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md"
          onClick={handleLogout}
        >
          Logout
        </button>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map(card => (
            <div
              key={card.route}
              onClick={() => router.push(card.route)}
              className="cursor-pointer border-2 rounded-xl p-6 shadow-md hover:shadow-xl hover:border-red-400 transition bg-white"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
