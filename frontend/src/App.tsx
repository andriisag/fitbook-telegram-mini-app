import { useEffect, useState } from 'react'

const API_URL = 'https://2ff3-178-212-106-203.ngrok-free.app'

type Trainer = {
  id: number
  name: string
  specialty: string
  bio: string
  price: number
  rating: number
  experience_years: number
  sessions_count: number
}

type Availability = {
  id: number
  date: string
  time: string
}

type Booking = {
  id: number
  trainer_id: number
  telegram_user_id: number
  customer_name: string
  date: string
  start_time: string
  status: string
}

type Screen =
  | { type: 'home' }
  | { type: 'profile'; trainer: Trainer }
  | { type: 'booking'; trainer: Trainer }
  | { type: 'confirmation'; trainer: Trainer; booking: Booking }
  | { type: 'bookings' }

function Home({
  trainers,
  onSelectTrainer,
  onOpenBookings,
}: {
  trainers: Trainer[]
  onSelectTrainer: (trainer: Trainer) => void
  onOpenBookings: () => void
}) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="mx-auto max-w-md px-5 pb-8">
        <header className="flex items-center justify-between pt-6 pb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FF3B1F]">
              FitBook
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              Find your
              <br />
              <span className="text-white">next trainer.</span>
            </h1>
          </div>

          <button
            onClick={onOpenBookings}
            className="rounded-full border border-white/10 bg-[#1A1A1A] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
          >
            My bookings
          </button>
        </header>

        <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#1A1A1A]">
          <div className="relative h-52 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80"
              alt="Fitness training"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF3B1F]">
                Personal training
              </p>

              <h2 className="mt-1 text-2xl font-extrabold">
                Train harder.
                <br />
                Move better.
              </h2>
            </div>
          </div>
        </section>

        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Available now
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Choose your trainer
            </h2>
          </div>
        </div>

        {trainers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6 text-center text-white/50">
            No trainers available.
          </div>
        ) : (
          <div className="space-y-4">
            {trainers.map((trainer) => (
              <button
                key={trainer.id}
                onClick={() => onSelectTrainer(trainer)}
                className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#1A1A1A] text-left transition active:scale-[0.98]"
              >
                <div className="flex gap-4 p-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#252525]">
                    <img
                      src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80"
                      alt={trainer.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-extrabold">
                          {trainer.name}
                        </h3>

                        <p className="mt-1 text-sm text-white/50">
                          {trainer.specialty}
                        </p>
                      </div>

                      <div className="rounded-full bg-[#FF3B1F]/10 px-2.5 py-1 text-xs font-bold text-[#FF3B1F]">
                        ★ {trainer.rating}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-white/40">
                        {trainer.experience_years} years ·{' '}
                        {trainer.sessions_count} sessions
                      </p>

                      <p className="text-lg font-extrabold">
                        ${trainer.price}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TrainerProfile({
  trainer,
  onBack,
  onBook,
}: {
  trainer: Trainer
  onBack: () => void
  onBook: () => void
}) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="mx-auto max-w-md">
        <div className="relative h-80 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80"
            alt={trainer.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-black/20 to-transparent" />

          <button
            onClick={onBack}
            className="absolute left-5 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-xl backdrop-blur"
          >
            ←
          </button>

          <div className="absolute bottom-6 left-5 right-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF3B1F]">
              Personal trainer
            </p>

            <h1 className="mt-1 text-3xl font-extrabold">
              {trainer.name}
            </h1>

            <p className="mt-1 text-white/60">
              {trainer.specialty}
            </p>
          </div>
        </div>

        <div className="px-5 pb-8">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 text-center">
              <p className="text-lg font-extrabold">
                ★ {trainer.rating}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                Rating
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 text-center">
              <p className="text-lg font-extrabold">
                {trainer.experience_years}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                Years
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 text-center">
              <p className="text-lg font-extrabold">
                {trainer.sessions_count}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                Sessions
              </p>
            </div>
          </div>

          <section className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF3B1F]">
              About
            </p>

            <p className="mt-3 text-sm leading-7 text-white/60">
              {trainer.bio}
            </p>
          </section>

          <div className="mt-8 rounded-2xl border border-white/10 bg-[#1A1A1A] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Session price
                </p>

                <p className="mt-1 text-3xl font-extrabold">
                  ${trainer.price}
                </p>
              </div>

              <button
                onClick={onBook}
                className="rounded-2xl bg-[#FF3B1F] px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-white"
              >
                Book session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookingScreen({
  trainer,
  onBack,
  onBooked,
}: {
  trainer: Trainer
  onBack: () => void
  onBooked: (booking: Booking) => void
}) {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [selectedSlot, setSelectedSlot] =
    useState<Availability | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    fetch(`${API_URL}/trainers/${trainer.id}/availability`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to load availability.')
        }

        return response.json()
      })
      .then((data) => {
        setAvailability(data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [trainer.id])

  const groupedAvailability = availability.reduce(
    (groups: Record<string, Availability[]>, slot) => {
      if (!groups[slot.date]) {
        groups[slot.date] = []
      }

      groups[slot.date].push(slot)

      return groups
    },
    {},
  )

  const handleBooking = async () => {
    if (!selectedSlot) {
      return
    }

    const telegram = window.Telegram?.WebApp

    if (!telegram?.initData) {
      setError('Telegram authentication data is unavailable.')
      return
    }

    setBooking(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          init_data: telegram.initData,
          trainer_id: trainer.id,
          date: selectedSlot.date,
          start_time: selectedSlot.time,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Failed to create booking.',
        )
      }

      onBooked(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Booking failed.',
      )
    } finally {
      setBooking(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="mx-auto max-w-md px-5 pb-8">
        <header className="flex items-center gap-4 py-6">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#1A1A1A] text-xl"
          >
            ←
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#FF3B1F]">
              Booking
            </p>

            <h1 className="text-xl font-extrabold">
              {trainer.name}
            </h1>
          </div>
        </header>

        {loading ? (
          <div className="py-20 text-center text-white/40">
            Loading available times...
          </div>
        ) : availability.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-6 text-center">
            <p className="font-bold">No available sessions</p>

            <p className="mt-2 text-sm text-white/40">
              Please check again later.
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            {Object.entries(groupedAvailability).map(
              ([date, slots]) => (
                <section key={date}>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                    {new Date(
                      `${date}T00:00:00`,
                    ).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot) => {
                      const selected =
                        selectedSlot?.id === slot.id

                      return (
                        <button
                          key={slot.id}
                          onClick={() =>
                            setSelectedSlot(slot)
                          }
                          className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                            selected
                              ? 'border-[#FF3B1F] bg-[#FF3B1F] text-white'
                              : 'border-white/10 bg-[#1A1A1A] text-white/70'
                          }`}
                        >
                          {slot.time.slice(0, 5)}
                        </button>
                      )
                    })}
                  </div>
                </section>
              ),
            )}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="sticky bottom-0 mt-8 border-t border-white/10 bg-[#0F0F0F]/95 py-4 backdrop-blur">
          <button
            disabled={!selectedSlot || booking}
            onClick={handleBooking}
            className="w-full rounded-2xl bg-[#FF3B1F] px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            {booking ? 'Booking...' : 'Confirm booking'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Confirmation({
  trainer,
  booking,
  onHome,
  onBookings,
}: {
  trainer: Trainer
  booking: Booking
  onHome: () => void
  onBookings: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-5 text-white">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FF3B1F] text-4xl">
          ✓
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-[#FF3B1F]">
          Booking confirmed
        </p>

        <h1 className="mt-3 text-3xl font-extrabold">
          You're booked.
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/50">
          Your session with {trainer.name} has been successfully
          booked.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#1A1A1A] p-6 text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40">
                Trainer
              </p>

              <p className="mt-1 font-bold">
                {trainer.name}
              </p>
            </div>

            <p className="font-extrabold text-[#FF3B1F]">
              ${trainer.price}
            </p>
          </div>

          <div className="pt-4">
            <p className="text-xs uppercase tracking-wider text-white/40">
              Date & time
            </p>

            <p className="mt-1 font-bold">
              {booking.date} · {booking.start_time.slice(0, 5)}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={onBookings}
            className="w-full rounded-2xl bg-[#FF3B1F] px-5 py-4 text-sm font-extrabold uppercase tracking-wide"
          >
            My bookings
          </button>

          <button
            onClick={onHome}
            className="w-full rounded-2xl border border-white/10 bg-[#1A1A1A] px-5 py-4 text-sm font-extrabold uppercase tracking-wide"
          >
            Back to trainers
          </button>
        </div>
      </div>
    </div>
  )
}

function MyBookings({
  onBack,
}: {
  onBack: () => void
}) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBookings = () => {
    const telegram = window.Telegram?.WebApp

    if (!telegram?.initData) {
      setError('Telegram authentication data is unavailable.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const initData = encodeURIComponent(
      telegram.initData,
    )

    fetch(`${API_URL}/bookings?init_data=${initData}`)
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json()

          throw new Error(
            data.detail || 'Failed to load bookings.',
          )
        }

        return response.json()
      })
      .then((data) => {
        setBookings(data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const cancelBooking = async (bookingId: number) => {
    const telegram = window.Telegram?.WebApp

    if (!telegram?.initData) {
      setError(
        'Telegram authentication data is unavailable.',
      )
      return
    }

    try {
      const initData = encodeURIComponent(
        telegram.initData,
      )

      const response = await fetch(
        `${API_URL}/bookings/${bookingId}?init_data=${initData}`,
        {
          method: 'DELETE',
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Failed to cancel booking.',
        )
      }

      loadBookings()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Cancellation failed.',
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="mx-auto max-w-md px-5 pb-8">
        <header className="flex items-center gap-4 py-6">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#1A1A1A] text-xl"
          >
            ←
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#FF3B1F]">
              Schedule
            </p>

            <h1 className="text-xl font-extrabold">
              My bookings
            </h1>
          </div>
        </header>

        {loading ? (
          <div className="py-20 text-center text-white/40">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#1A1A1A] p-8 text-center">
            <p className="text-lg font-extrabold">
              No bookings yet
            </p>

            <p className="mt-2 text-sm text-white/40">
              Choose a trainer and book your first session.
            </p>

            <button
              onClick={onBack}
              className="mt-6 rounded-2xl bg-[#FF3B1F] px-5 py-3 text-sm font-extrabold uppercase tracking-wide"
            >
              Find a trainer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-3xl border border-white/10 bg-[#1A1A1A] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/40">
                      Booking #{booking.id}
                    </p>

                    <h2 className="mt-2 text-lg font-extrabold">
                      Trainer #{booking.trainer_id}
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#FF3B1F]/10 px-3 py-1 text-xs font-bold text-[#FF3B1F]">
                    Confirmed
                  </span>
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="font-bold">
                    {booking.date} ·{' '}
                    {booking.start_time.slice(0, 5)}
                  </p>
                </div>

                <button
                  onClick={() =>
                    cancelBooking(booking.id)
                  }
                  className="mt-5 w-full rounded-xl border border-white/10 bg-[#252525] px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/60"
                >
                  Cancel booking
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] =
    useState<Screen>({ type: 'home' })

  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const telegram = window.Telegram?.WebApp

    if (!telegram) {
      console.log(
        'Telegram WebApp is not available',
      )
      return
    }

    telegram.ready()
    telegram.expand()

    console.log(
      'Telegram WebApp initialized',
    )

    console.log(
      'Telegram user:',
      telegram.initDataUnsafe.user,
    )

    fetch(`${API_URL}/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        init_data: telegram.initData,
      }),
    })
      .then(async (response) => {
        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.detail ||
              'Telegram authentication failed',
          )
        }

        console.log(
          'Telegram authentication successful:',
          data,
        )
      })
      .catch((error) => {
        console.error(
          'Telegram authentication error:',
          error,
        )
      })
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/trainers`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            'Failed to load trainers.',
          )
        }

        return response.json()
      })
      .then((data) => {
        setTrainers(data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#FF3B1F]" />

          <p className="mt-4 text-sm text-white/40">
            Loading trainers...
          </p>
        </div>
      </div>
    )
  }

  if (error && trainers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-5 text-white">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#1A1A1A] p-6 text-center">
          <p className="text-lg font-extrabold">
            Something went wrong
          </p>

          <p className="mt-3 text-sm leading-6 text-white/50">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-2xl bg-[#FF3B1F] px-5 py-3 text-sm font-extrabold uppercase tracking-wide"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (screen.type === 'home') {
    return (
      <Home
        trainers={trainers}
        onSelectTrainer={(trainer) =>
          setScreen({
            type: 'profile',
            trainer,
          })
        }
        onOpenBookings={() =>
          setScreen({
            type: 'bookings',
          })
        }
      />
    )
  }

  if (screen.type === 'profile') {
    return (
      <TrainerProfile
        trainer={screen.trainer}
        onBack={() =>
          setScreen({
            type: 'home',
          })
        }
        onBook={() =>
          setScreen({
            type: 'booking',
            trainer: screen.trainer,
          })
        }
      />
    )
  }

  if (screen.type === 'booking') {
    return (
      <BookingScreen
        trainer={screen.trainer}
        onBack={() =>
          setScreen({
            type: 'profile',
            trainer: screen.trainer,
          })
        }
        onBooked={(booking) =>
          setScreen({
            type: 'confirmation',
            trainer: screen.trainer,
            booking,
          })
        }
      />
    )
  }

  if (screen.type === 'confirmation') {
    return (
      <Confirmation
        trainer={screen.trainer}
        booking={screen.booking}
        onHome={() =>
          setScreen({
            type: 'home',
          })
        }
        onBookings={() =>
          setScreen({
            type: 'bookings',
          })
        }
      />
    )
  }

  return (
    <MyBookings
      onBack={() =>
        setScreen({
          type: 'home',
        })
      }
    />
  )
}

