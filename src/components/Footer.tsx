export function Footer() {
  return (
    <footer className="py-[clamp(1.5rem,3vw,4rem)] px-[clamp(1.5rem,4vw,6rem)] bg-zinc-50 border-t border-zinc-200 w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="w-[90vw] mx-auto flex flex-col md:flex-row items-center justify-between gap-[clamp(1rem,2vw,3rem)]">
        <p className="text-zinc-500 text-[clamp(0.8rem,1vw,1.2rem)] font-light">
          © {new Date().getFullYear()} Robert Musin. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
