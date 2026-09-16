import { useEffect, useState, type ReactNode } from 'react'

const API_URL = import.meta.env.VITE_API_URL

type Trainer = {
  id: number
  name: string
  image_url: string
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
  trainer_name: string
  telegram_user_id: number
  customer_name: string
  date: string
  start_time: string
  status: string
}

type TelegramUser = {
  id?: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

type Screen =
  | { type: 'home' }
  | { type: 'trainers' }
  | { type: 'profile'; trainer: Trainer }
  | { type: 'booking'; trainer: Trainer }
  | {
      type: 'confirmation'
      trainer: Trainer
      booking: Booking
    }
  | { type: 'bookings' }

function ArrowLeftIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="3"
      />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 9h18" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="m12 3 2.8 5.67 6.26.91-4.53 4.42 1.07 6.24L12 17.29 6.4 20.24l1.07-6.24L2.94 9.58l6.26-.91L12 3Z" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

function ScreenWrapper({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="animate-[fitbookIn_280ms_ease-out]">
      {children}
    </div>
  )
}

function PageContainer({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0C0C0D] text-white">
      <div className="mx-auto min-h-screen max-w-md px-5 pb-8">
        {children}
      </div>
    </div>
  )
}

function SectionLabel({
  children,
}: {
  children: ReactNode
}) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
      {children}
    </p>
  )
}

function BackButton({
  onClick,
}: {
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Go back"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#171718] text-white/75 transition-all duration-200 hover:border-white/20 hover:bg-[#202021] hover:text-white active:scale-90"
    >
      <ArrowLeftIcon />
    </button>
  )
}

function TrainerCard({
  trainer,
  onClick,
}: {
  trainer: Trainer
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-[24px] border border-white/10 bg-[#151516] p-3.5 text-left shadow-[0_12px_40px_rgba(0,0,0,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-[#19191A] active:translate-y-0 active:scale-[0.985]"
    >
      <div className="flex gap-4">
        <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-[19px] bg-[#202021]">
          <img
            src={trainer.image_url}
            alt={trainer.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold backdrop-blur-md">
            <StarIcon />
            {trainer.rating}
          </div>
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[17px] font-extrabold">
                {trainer.name}
              </h3>

              <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/40">
                {trainer.specialty}
              </p>
            </div>

            <div className="shrink-0 pt-0.5 text-white/25 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-white/55">
              <ChevronRightIcon />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-2">
            <p className="text-xs text-white/35">
              {trainer.experience_years} years experience
            </p>

            <p className="text-sm font-extrabold text-[#FF3B1F]">
              ${trainer.price}
              <span className="ml-1 text-[10px] font-medium text-white/25">
                / session
              </span>
            </p>
          </div>
        </div>
      </div>
    </button>
  )
}

function Home({
  trainers,
  onSelectTrainer,
  onOpenBookings,
  onOpenTrainers,
  telegramUser,
}: {
  trainers: Trainer[]
  onSelectTrainer: (trainer: Trainer) => void
  onOpenBookings: () => void
  onOpenTrainers: () => void
  telegramUser: TelegramUser | null
}) {
  const firstName =
    telegramUser?.first_name || 'there'

  return (
    <ScreenWrapper>
      <PageContainer>
        <header className="flex items-center justify-between pt-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF3B1F]">
              FitBook
            </p>

            <p className="mt-3 text-sm font-medium text-white/40">
              Welcome back, {firstName}
            </p>

            <h1 className="mt-1 text-[32px] font-black leading-[1.05] tracking-[-0.04em]">
              Find your
              <br />
              <span className="text-white/92">
                next trainer.
              </span>
            </h1>
          </div>

          <button
            onClick={onOpenBookings}
            aria-label="My bookings"
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#171718] transition-all duration-200 hover:border-white/20 hover:bg-[#202021] active:scale-90"
          >
            {telegramUser?.photo_url ? (
              <img
                src={telegramUser.photo_url}
                alt={firstName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-white/80">
                {firstName.charAt(0).toUpperCase()}
              </span>
            )}
          </button>
        </header>

        <section className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#161617] shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
          <div className="relative aspect-[1.18] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=85"
              alt="Fitness training"
              className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

            <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
              Personal training
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className="max-w-[280px] text-[28px] font-black leading-[1.05] tracking-[-0.035em]">
                Train smarter.
                <br />
                Feel stronger.
              </h2>

              <p className="mt-3 max-w-[275px] text-sm leading-5 text-white/55">
                Book a session with a coach that fits your goals.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-9">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <SectionLabel>
                Discover
              </SectionLabel>

              <h2 className="mt-1.5 text-[22px] font-black tracking-[-0.025em]">
                Featured trainers
              </h2>
            </div>

            <button
              onClick={onOpenTrainers}
              className="flex items-center gap-1 text-xs font-bold text-white/45 transition hover:text-white active:scale-95"
            >
              View all
              <ChevronRightIcon />
            </button>
          </div>

          <div className="space-y-3.5">
            {trainers.slice(0, 3).map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onClick={() =>
                  onSelectTrainer(trainer)
                }
              />
            ))}
          </div>
        </section>
      </PageContainer>
    </ScreenWrapper>
  )
}

function Trainers({
  trainers,
  onBack,
  onSelectTrainer,
}: {
  trainers: Trainer[]
  onBack: () => void
  onSelectTrainer: (trainer: Trainer) => void
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = [
    'All',
    'Strength',
    'Weight Loss',
    'Functional',
    'Mobility & Yoga',
    'Muscle Building',
  ]

  const filteredTrainers = trainers.filter(
    (trainer) => {
      const normalizedSearch =
        search.trim().toLowerCase()

      const matchesSearch =
        trainer.name
          .toLowerCase()
          .includes(normalizedSearch)

      const specialty =
        trainer.specialty.toLowerCase()

      let matchesCategory = true

      if (category === 'Strength') {
        matchesCategory =
          specialty.includes('strength')
      }

      if (category === 'Weight Loss') {
        matchesCategory =
          specialty.includes('weight loss')
      }

      if (category === 'Functional') {
        matchesCategory =
          specialty.includes('functional')
      }

      if (category === 'Mobility & Yoga') {
        matchesCategory =
          specialty.includes('mobility') ||
          specialty.includes('yoga')
      }

      if (category === 'Muscle Building') {
        matchesCategory =
          specialty.includes('muscle')
      }

      return (
        matchesSearch &&
        matchesCategory
      )
    },
  )

  return (
    <ScreenWrapper>
      <PageContainer>
        <header className="flex items-center gap-3 pt-6">
          <BackButton onClick={onBack} />

          <div>
            <SectionLabel>
              Discover
            </SectionLabel>

            <h1 className="mt-1 text-[22px] font-black tracking-[-0.025em]">
              Find your trainer
            </h1>
          </div>
        </header>

        <div className="relative mt-6">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/25">
            <SearchIcon />
          </div>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search trainers..."
            className="h-12 w-full rounded-[18px] border border-white/10 bg-[#151516] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/20"
          />
        </div>

        <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {categories.map((item) => {
            const active = category === item

            return (
              <button
                key={item}
                onClick={() =>
                  setCategory(item)
                }
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                  active
                    ? 'border-[#FF3B1F] bg-[#FF3B1F] text-white'
                    : 'border-white/10 bg-[#151516] text-white/40 hover:border-white/20 hover:text-white/70'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>

        <div className="mt-7 flex items-end justify-between">
          <div>
            <SectionLabel>
              Trainers
            </SectionLabel>

            <h2 className="mt-1.5 text-xl font-black">
              {filteredTrainers.length}{' '}
              {filteredTrainers.length === 1
                ? 'trainer'
                : 'trainers'}
            </h2>
          </div>
        </div>

        {filteredTrainers.length === 0 ? (
          <div className="mt-6 rounded-[26px] border border-white/10 bg-[#151516] p-7 text-center">
            <p className="text-base font-extrabold">
              No trainers found
            </p>

            <p className="mt-2 text-sm leading-5 text-white/35">
              Try a different name or specialization.
            </p>

            {(search || category !== 'All') && (
              <button
                onClick={() => {
                  setSearch('')
                  setCategory('All')
                }}
                className="mt-5 rounded-xl bg-white/5 px-4 py-2.5 text-xs font-bold text-white/70 transition hover:bg-white/10 active:scale-95"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-3.5">
            {filteredTrainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onClick={() =>
                  onSelectTrainer(trainer)
                }
              />
            ))}
          </div>
        )}
      </PageContainer>
    </ScreenWrapper>
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
    <ScreenWrapper>
      <PageContainer>
        <header className="flex items-center gap-3 pt-6">
          <BackButton onClick={onBack} />

          <div className="min-w-0">
            <SectionLabel>
              Trainer profile
            </SectionLabel>

            <h1 className="mt-1 truncate text-lg font-extrabold">
              {trainer.name}
            </h1>
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[#151516] shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
          <div className="relative aspect-[1.08]">
            <img
              src={trainer.image_url}
              alt={trainer.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF3B1F]">
                {trainer.specialty}
              </p>

              <h2 className="mt-1 text-[30px] font-black leading-none tracking-[-0.04em]">
                {trainer.name}
              </h2>
            </div>
          </div>

          <div className="p-5">
            <p className="text-sm leading-6 text-white/52">
              {trainer.bio}
            </p>

            <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-[20px] border border-white/10 bg-[#101011] py-4">
              <div className="px-3 text-center">
                <div className="flex justify-center text-[#FF3B1F]">
                  <StarIcon />
                </div>

                <p className="mt-1 text-base font-black">
                  {trainer.rating}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/30">
                  Rating
                </p>
              </div>

              <div className="px-3 text-center">
                <p className="text-base font-black">
                  {trainer.experience_years}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/30">
                  Years
                </p>
              </div>

              <div className="px-3 text-center">
                <p className="text-base font-black">
                  {trainer.sessions_count}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/30">
                  Sessions
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-[#151516] px-5 py-4">
          <div>
            <SectionLabel>
              Session price
            </SectionLabel>

            <p className="mt-1 text-xl font-black">
              ${trainer.price}
            </p>
          </div>

          <button
            onClick={onBook}
            className="flex items-center gap-2 rounded-2xl bg-[#FF3B1F] px-5 py-3.5 text-sm font-extrabold transition-all duration-200 hover:brightness-110 active:scale-[0.96]"
          >
            Book session
            <ArrowRightIcon />
          </button>
        </div>
      </PageContainer>
    </ScreenWrapper>
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
  const [availability, setAvailability] =
    useState<Availability[]>([])

  const [selectedSlot, setSelectedSlot] =
    useState<Availability | null>(null)

  const [selectedDate, setSelectedDate] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [booking, setBooking] =
    useState(false)

  const [error, setError] =
    useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    setSelectedSlot(null)

    fetch(
      `${API_URL}/trainers/${trainer.id}/availability`,
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            'Failed to load availability.',
          )
        }

        return response.json()
      })
      .then((data) => {
        setAvailability(data)

        if (data.length > 0) {
          setSelectedDate(data[0].date)
        } else {
          setSelectedDate('')
        }
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load availability.',
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [trainer.id])

  const groupedAvailability =
    availability.reduce(
      (
        groups: Record<
          string,
          Availability[]
        >,
        slot,
      ) => {
        if (!groups[slot.date]) {
          groups[slot.date] = []
        }

        groups[slot.date].push(slot)

        return groups
      },
      {},
    )

  const dates =
    Object.keys(groupedAvailability)

  const selectedDateSlots =
    groupedAvailability[selectedDate] ?? []

  const handleBooking = async () => {
    if (!selectedSlot) {
      return
    }

    const telegram =
      window.Telegram?.WebApp

    if (!telegram?.initData) {
      setError(
        'Telegram authentication data is unavailable.',
      )
      return
    }

    setBooking(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/bookings`,
        {
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
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
            'Failed to create booking.',
        )
      }

      onBooked(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Booking failed.',
      )
    } finally {
      setBooking(false)
    }
  }

  const formatDate = (date: string) => {
    const dateObject = new Date(
      `${date}T00:00:00`,
    )

    return {
      weekday:
        dateObject.toLocaleDateString(
          'en-US',
          {
            weekday: 'short',
          },
        ),
      day: dateObject.getDate(),
      month:
        dateObject.toLocaleDateString(
          'en-US',
          {
            month: 'short',
          },
        ),
    }
  }

  const selectedDateInfo = selectedSlot
    ? formatDate(selectedSlot.date)
    : null

  return (
    <ScreenWrapper>
      <PageContainer>
        <header className="flex items-center gap-3 pt-6">
          <BackButton onClick={onBack} />

          <div className="min-w-0">
            <SectionLabel>
              Book a session
            </SectionLabel>

            <h1 className="mt-1 truncate text-lg font-extrabold">
              {trainer.name}
            </h1>
          </div>
        </header>

        <div className="mt-7">
          {loading ? (
            <div className="space-y-8">
              <section>
                <div className="mb-3 h-3 w-24 animate-pulse rounded-full bg-white/10" />

                <div className="flex gap-2 overflow-hidden">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-[92px] min-w-[74px] animate-pulse rounded-[20px] bg-[#161617]"
                      />
                    ),
                  )}
                </div>
              </section>

              <section>
                <div className="mb-3 h-3 w-32 animate-pulse rounded-full bg-white/10" />

                <div className="grid grid-cols-3 gap-2.5">
                  {[1, 2, 3, 4, 5, 6].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-12 animate-pulse rounded-2xl bg-[#161617]"
                      />
                    ),
                  )}
                </div>
              </section>
            </div>
          ) : availability.length === 0 ? (
            <div className="rounded-[26px] border border-white/10 bg-[#151516] p-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/50">
                <CalendarIcon />
              </div>

              <h2 className="mt-4 text-lg font-extrabold">
                No available sessions
              </h2>

              <p className="mt-2 text-sm leading-5 text-white/35">
                There are currently no open slots for this trainer.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <SectionLabel>
                    Select date
                  </SectionLabel>

                  <span className="text-[11px] text-white/25">
                    {dates.length} days
                  </span>
                </div>

                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {dates.map((date) => {
                    const selected =
                      selectedDate === date

                    const formatted =
                      formatDate(date)

                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date)
                          setSelectedSlot(null)
                          setError('')
                        }}
                        className={`min-w-[76px] rounded-[20px] border px-2.5 py-3.5 text-center transition-all duration-200 active:scale-95 ${
                          selected
                            ? 'border-[#FF3B1F] bg-[#FF3B1F] shadow-[0_10px_30px_rgba(255,59,31,0.22)]'
                            : 'border-white/10 bg-[#151516] hover:border-white/20 hover:bg-[#1B1B1C]'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-bold uppercase tracking-wide ${
                            selected
                              ? 'text-white/80'
                              : 'text-white/30'
                          }`}
                        >
                          {formatted.weekday}
                        </p>

                        <p className="mt-1 text-[25px] font-black leading-none">
                          {formatted.day}
                        </p>

                        <p
                          className={`mt-1 text-[10px] uppercase ${
                            selected
                              ? 'text-white/70'
                              : 'text-white/25'
                          }`}
                        >
                          {formatted.month}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </section>

              <section>
                <SectionLabel>
                  Available times
                </SectionLabel>

                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {selectedDateSlots.map(
                    (slot) => {
                      const selected =
                        selectedSlot?.id === slot.id

                      return (
                        <button
                          key={slot.id}
                          onClick={() => {
                            setSelectedSlot(
                              slot,
                            )
                            setError('')
                          }}
                          className={`rounded-2xl border px-3 py-3.5 text-sm font-bold transition-all duration-200 active:scale-95 ${
                            selected
                              ? 'border-[#FF3B1F] bg-[#FF3B1F] shadow-[0_8px_22px_rgba(255,59,31,0.18)]'
                              : 'border-white/10 bg-[#151516] text-white/60 hover:border-white/20 hover:bg-[#1B1B1C] hover:text-white'
                          }`}
                        >
                          {slot.time.slice(
                            0,
                            5,
                          )}
                        </button>
                      )
                    },
                  )}
                </div>
              </section>

              {selectedSlot &&
                selectedDateInfo && (
                  <section className="rounded-[24px] border border-white/10 bg-[#151516] p-5">
                    <SectionLabel>
                      Session summary
                    </SectionLabel>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-2xl">
                          <img
                            src={trainer.image_url}
                            alt={trainer.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-extrabold">
                            {trainer.name}
                          </p>

                          <p className="mt-1 text-xs text-white/35">
                            Personal training
                          </p>
                        </div>
                      </div>

                      <p className="text-lg font-black text-[#FF3B1F]">
                        ${trainer.price}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#101011] px-3 py-2.5 text-xs text-white/55">
                        <CalendarIcon />

                        <span>
                          {selectedDateInfo.weekday},{' '}
                          {selectedDateInfo.day}{' '}
                          {selectedDateInfo.month}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-[#101011] px-3 py-2.5 text-xs text-white/55">
                        <ClockIcon />

                        <span>
                          {selectedSlot.time.slice(
                            0,
                            5,
                          )}
                        </span>
                      </div>
                    </div>
                  </section>
                )}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-5 rounded-[22px] border border-red-500/15 bg-red-500/10 p-4">
            <p className="text-sm font-bold text-red-200">
              Something went wrong
            </p>

            <p className="mt-1 text-xs leading-5 text-red-300/65">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          availability.length > 0 && (
            <div className="sticky bottom-0 -mx-5 mt-7 border-t border-white/10 bg-[#0C0C0D]/90 px-5 py-4 backdrop-blur-xl">
              <button
                disabled={
                  !selectedSlot || booking
                }
                onClick={handleBooking}
                className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#FF3B1F] px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_12px_35px_rgba(255,59,31,0.16)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-25 disabled:shadow-none"
              >
                {booking ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Booking...
                  </>
                ) : (
                  <>
                    Confirm booking
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </div>
          )}
      </PageContainer>
    </ScreenWrapper>
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
  const formattedDate = new Date(
    `${booking.date}T00:00:00`,
  ).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <ScreenWrapper>
      <div className="flex min-h-screen items-center justify-center bg-[#0C0C0D] px-5 text-white">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="relative mx-auto h-[88px] w-[88px]">
              <div className="absolute inset-0 rounded-full bg-[#FF3B1F]/15 blur-2xl" />

              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#FF3B1F] shadow-[0_14px_45px_rgba(255,59,31,0.22)]">
                <CheckIcon />
              </div>
            </div>

            <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF3B1F]">
              Booking confirmed
            </p>

            <h1 className="mt-2 text-[34px] font-black tracking-[-0.045em]">
              You're all set.
            </h1>

            <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-white/40">
              Your session with {trainer.name} has been successfully booked.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#151516] shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-4 border-b border-white/10 p-5">
              <img
                src={trainer.image_url}
                alt={trainer.name}
                className="h-14 w-14 rounded-[18px] object-cover"
              />

              <div className="min-w-0 flex-1">
                <SectionLabel>
                  Trainer
                </SectionLabel>

                <p className="mt-1 truncate text-base font-extrabold">
                  {trainer.name}
                </p>
              </div>

              <p className="text-lg font-black text-[#FF3B1F]">
                ${trainer.price}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              <div className="rounded-2xl bg-[#101011] p-4">
                <div className="flex items-center gap-2 text-white/30">
                  <CalendarIcon />

                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Date
                  </span>
                </div>

                <p className="mt-3 text-sm font-bold leading-5">
                  {formattedDate}
                </p>
              </div>

              <div className="rounded-2xl bg-[#101011] p-4">
                <div className="flex items-center gap-2 text-white/30">
                  <ClockIcon />

                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Time
                  </span>
                </div>

                <p className="mt-3 text-sm font-bold">
                  {booking.start_time.slice(
                    0,
                    5,
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={onBookings}
              className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#FF3B1F] px-5 py-4 text-sm font-extrabold uppercase tracking-wide transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              View my bookings
              <ArrowRightIcon />
            </button>

            <button
              onClick={onHome}
              className="w-full rounded-[20px] border border-white/10 bg-[#151516] px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-white/85 transition-all duration-200 hover:border-white/20 hover:bg-[#1B1B1C] active:scale-[0.98]"
            >
              Back to trainers
            </button>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  )
}

function MyBookings({
  onBack,
}: {
  onBack: () => void
}) {
  const [bookings, setBookings] =
    useState<Booking[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [cancellingId, setCancellingId] =
    useState<number | null>(null)

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null)

  const loadBookings = async () => {
    const telegram =
      window.Telegram?.WebApp

    if (!telegram?.initData) {
      setError(
        'Telegram authentication data is unavailable.',
      )
      setLoading(false)
      return
    }

    try {
      setError('')

      const response = await fetch(
        `${API_URL}/bookings?init_data=${encodeURIComponent(
          telegram.initData,
        )}`,
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
            'Failed to load bookings.',
        )
      }

      setBookings(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load bookings.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleCancel = async (
    bookingId: number,
  ) => {
    const telegram =
      window.Telegram?.WebApp

    if (!telegram?.initData) {
      setError(
        'Telegram authentication data is unavailable.',
      )
      return
    }

    setCancellingId(bookingId)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingId}?init_data=${encodeURIComponent(
          telegram.initData,
        )}`,
        {
          method: 'DELETE',
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
            'Failed to cancel booking.',
        )
      }

      setBookings(
        (currentBookings) =>
          currentBookings.filter(
            (booking) =>
              booking.id !== bookingId,
          ),
      )

      setSelectedBooking(null)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to cancel booking.',
      )
    } finally {
      setCancellingId(null)
    }
  }

  const formatDate = (date: string) =>
    new Date(
      `${date}T00:00:00`,
    ).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })

  return (
    <ScreenWrapper>
      <PageContainer>
        <header className="flex items-center gap-3 pt-6">
          <BackButton onClick={onBack} />

          <div>
            <SectionLabel>
              Bookings
            </SectionLabel>

            <h1 className="mt-1 text-[22px] font-black tracking-[-0.025em]">
              My bookings
            </h1>
          </div>
        </header>

        <div className="mt-7">
          {loading ? (
            <div className="space-y-3.5">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-[190px] animate-pulse rounded-[26px] bg-[#151516]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[26px] border border-red-500/15 bg-red-500/10 p-5">
              <p className="text-sm font-bold text-red-200">
                Something went wrong
              </p>

              <p className="mt-1 text-xs leading-5 text-red-300/65">
                {error}
              </p>

              <button
                onClick={loadBookings}
                className="mt-4 rounded-xl bg-white/5 px-4 py-2.5 text-xs font-bold text-white/70 transition hover:bg-white/10 active:scale-95"
              >
                Try again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-[#151516] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/35">
                <CalendarIcon />
              </div>

              <h2 className="mt-4 text-lg font-extrabold">
                No bookings yet
              </h2>

              <p className="mx-auto mt-2 max-w-[240px] text-sm leading-5 text-white/35">
                Your upcoming training sessions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {bookings.map((booking) => {
                const cancelling =
                  cancellingId === booking.id

                return (
                  <div
                    key={booking.id}
                    className="rounded-[26px] border border-white/10 bg-[#151516] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.14)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <SectionLabel>
                          Trainer
                        </SectionLabel>

                        <h2 className="mt-1.5 truncate text-lg font-extrabold">
                          {booking.trainer_name}
                        </h2>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[#101011] p-4">
                        <div className="flex items-center gap-2 text-white/30">
                          <CalendarIcon />

                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Date
                          </span>
                        </div>

                        <p className="mt-3 text-sm font-bold">
                          {formatDate(
                            booking.date,
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#101011] p-4">
                        <div className="flex items-center gap-2 text-white/30">
                          <ClockIcon />

                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Time
                          </span>
                        </div>

                        <p className="mt-3 text-sm font-bold">
                          {booking.start_time.slice(
                            0,
                            5,
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setSelectedBooking(
                          booking,
                        )
                      }
                      disabled={cancelling}
                      className="mt-4 w-full rounded-[18px] border border-red-500/15 bg-red-500/5 px-4 py-3 text-xs font-bold uppercase tracking-wide text-red-300 transition-all duration-200 hover:border-red-500/25 hover:bg-red-500/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Cancel booking
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </PageContainer>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-[fitbookIn_220ms_ease-out] rounded-[28px] border border-white/10 bg-[#171718] p-5 text-white shadow-[0_-20px_80px_rgba(0,0,0,0.45)]">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-white/10" />

            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-400">
                Cancel booking
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white">
                Cancel this session?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Your session with{' '}
                <span className="font-semibold text-white/65">
                  {
                    selectedBooking.trainer_name
                  }
                </span>{' '}
                on{' '}
                <span className="font-semibold text-white/65">
                  {formatDate(
                    selectedBooking.date,
                  )}
                </span>{' '}
                at{' '}
                <span className="font-semibold text-white/65">
                  {selectedBooking.start_time.slice(
                    0,
                    5,
                  )}
                </span>{' '}
                will be cancelled.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                disabled={
                  cancellingId !== null
                }
                className="rounded-[18px] border border-white/10 bg-[#202021] px-4 py-3.5 text-sm font-bold text-white/80 transition hover:bg-[#252526] hover:text-white active:scale-[0.98] disabled:opacity-40"
              >
                Keep booking
              </button>

              <button
                onClick={() =>
                  handleCancel(
                    selectedBooking.id,
                  )
                }
                disabled={
                  cancellingId !== null
                }
                className="rounded-[18px] bg-red-500/15 px-4 py-3.5 text-sm font-bold text-red-300 transition hover:bg-red-500/20 active:scale-[0.98] disabled:opacity-40"
              >
                {cancellingId ===
                selectedBooking.id
                  ? 'Cancelling...'
                  : 'Yes, cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ScreenWrapper>
  )
}

export default function App() {
  const [screen, setScreen] =
    useState<Screen>({
      type: 'home',
    })

  const [trainers, setTrainers] =
    useState<Trainer[]>([])

  const [telegramUser, setTelegramUser] =
    useState<TelegramUser | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    const telegram =
      window.Telegram?.WebApp

    if (!telegram) {
      console.log(
        'Telegram WebApp is not available',
      )
      return
    }

    telegram.ready()
    telegram.expand()

    const user =
      telegram.initDataUnsafe.user as
        | TelegramUser
        | undefined

    console.log(
      'Telegram user:',
      user,
    )

    if (user) {
      setTelegramUser({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url,
      })
    }

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
      <div className="flex min-h-screen items-center justify-center bg-[#0C0C0D] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#FF3B1F]" />

          <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-white/30">
            Loading FitBook
          </p>
        </div>
      </div>
    )
  }

  if (error && trainers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0C0D] px-5 text-white">
        <div className="w-full max-w-md rounded-[28px] border border-red-500/15 bg-[#151516] p-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-300">
            ×
          </div>

          <p className="mt-5 text-lg font-extrabold">
            Something went wrong
          </p>

          <p className="mt-2 text-sm leading-6 text-white/35">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 w-full rounded-[18px] bg-[#FF3B1F] px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide transition hover:brightness-110 active:scale-[0.98]"
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
        telegramUser={telegramUser}
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
        onOpenTrainers={() =>
          setScreen({
            type: 'trainers',
          })
        }
      />
    )
  }

  if (screen.type === 'trainers') {
    return (
      <Trainers
        trainers={trainers}
        onBack={() =>
          setScreen({
            type: 'home',
          })
        }
        onSelectTrainer={(trainer) =>
          setScreen({
            type: 'profile',
            trainer,
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
            type: 'trainers',
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