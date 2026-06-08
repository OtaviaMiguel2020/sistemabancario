export default function AuthLayout() {
  return (
    <div className="relative py-24 sm:py-32 mt-5 bg-[#fa7000f3] text-white rounded-md overflow-hidden">

      <div className="px-10 flex flex-col gap-4 relative z-10">

        {/* Título principal */}
        <h2 className="text-3xl font-bold mb-1.5 text-white ">
          Cada conta aberta é um cliente conquistado, Sistema Comercial.
        </h2>
        <p className="text-sm font-semibold text-white/60">
          Inovação, Transparência e Proximidade — os valores que guiam cada processo.
        </p>

        {/* Mini dashboard preview */}
        <div className="mt-4 bg-white/10 rounded-xl p-4 border border-white/20">
          <img
            src="/mokup.png"
            alt="Dashboard preview"
            className="rounded-lg w-full object-cover"
          />
        </div>

      </div>
    </div>
  )
}