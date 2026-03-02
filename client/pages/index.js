import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const Filter = dynamic(() => import('../components/Filter'), {
  ssr: false,
})

export default function Home() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-6xl bg-white p-6 rounded-xl border-2 shadow-xl relative">
        <div className="mb-0 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-red-600">
            An In-Depth Analysis of Fully Remote Education
          </h1>
          <h2 className="mt-0 text-lg md:text-xl font-medium text-red-500">
            A Software Engineering Perspective
          </h2>
        </div>

        <Filter />
      </div>
    </div>
  )
}
