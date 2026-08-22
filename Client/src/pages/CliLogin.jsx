import { useSearchParams } from "react-router-dom";

export default function CliLogin() {
  const [params] = useSearchParams();
  const redirect = params.get("redirect");
  const redirectQuery = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google${redirectQuery}`;
  };

  const githubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github${redirectQuery}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-4xl border border-white/10 bg-slate-900/95 p-10 shadow-[0_0_80px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-cyan-400">DropUI CLI authentication</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Finish your terminal login securely
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
            Select a provider below to complete authentication for your CLI session. Once signed in, your terminal will receive the token automatically.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={googleLogin}
            className="group flex h-16 items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-red-600 px-5 text-base font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M23.64 12.2045C23.64 11.4318 23.5782 10.6814 23.4591 9.95897H12.2383V14.0427H18.6982C18.5691 15.5034 17.6846 16.7644 16.3491 17.5529V20.2701H20.6518C22.8127 18.1769 23.64 15.1121 23.64 12.2045Z" fill="#4285F4"/>
              <path d="M12.2382 24C14.9973 24 17.3327 23.1364 19.1936 21.6646L16.3478 18.948C15.3136 19.5982 14.0465 19.9764 12.2382 19.9764C9.57273 19.9764 7.33909 18.2373 6.44728 15.8964H2.94336V18.7282C4.81055 22.5891 8.26436 24 12.2382 24Z" fill="#34A853"/>
              <path d="M6.44728 15.8964C6.202 15.173 6.07091 14.4055 6.07091 13.6182C6.07091 12.8309 6.202 12.0635 6.44728 11.34V8.50818H2.94336C1.81909 10.4164 1.25 12.6727 1.25 13.6182C1.25 14.5636 1.81909 16.82 2.94336 18.7282L6.44728 15.8964Z" fill="#FBBC05"/>
              <path d="M12.2382 6.26273C13.6391 6.22182 15.0036 6.75 16.0427 7.74273L19.2409 4.54455C17.3018 2.73727 14.9973 1.66636 12.2382 1.66636C8.26436 1.66636 4.81055 3.07636 2.94336 6.93727L6.44728 9.76909C7.33909 7.42818 9.57273 5.68909 12.2382 5.68909V6.26273Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={githubLogin}
            className="group flex h-16 items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-5 text-base font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0.297852C5.373 0.297852 0 5.67085 0 12.2979C0 17.4839 3.438 21.8689 8.205 23.5429C8.805 23.6579 9.025 23.3219 9.025 23.0349C9.025 22.7789 9.015 22.1169 9.01 21.2049C5.672 21.9049 4.968 19.6539 4.968 19.6539C4.422 18.2889 3.633 17.9489 3.633 17.9489C2.546 17.2179 3.715 17.2329 3.715 17.2329C4.919 17.3199 5.555 18.4779 5.555 18.4779C6.64 20.2559 8.356 19.7089 9.048 19.4119C9.161 18.6439 9.477 18.1109 9.83 17.8179C7.165 17.5189 4.343 16.4549 4.343 11.7089C4.343 10.3759 4.8 9.28585 5.57 8.43485C5.445 8.13185 5.045 6.86385 5.695 5.17685C5.695 5.17685 6.695 4.85985 8.995 6.41985C9.94 6.15485 10.94 6.02385 11.94 6.01985C12.94 6.02385 13.94 6.15485 14.885 6.41985C17.185 4.85985 18.185 5.17685 18.185 5.17685C18.835 6.86385 18.435 8.13185 18.31 8.43485C19.08 9.28585 19.535 10.3759 19.535 11.7089C19.535 16.4679 16.71 17.5149 14.04 17.8129C14.49 18.2149 14.89 19.0159 14.89 20.1759C14.89 21.8619 14.88 22.9999 14.88 23.0349C14.88 23.3229 15.095 23.6629 15.705 23.5429C20.465 21.8669 24 17.4839 24 12.2979C24 5.67085 18.627 0.297852 12 0.297852Z" />
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-400">
          <p className="font-semibold text-slate-100">CLI login flow</p>
          <p className="mt-3 leading-7">
            This screen is designed for terminal-based sign-in. Once you complete authentication, return to the terminal window and your CLI tool will finish logging in automatically.
          </p>
          {redirect ? (
            <p className="mt-3 text-slate-300">
              Redirect destination: <span className="font-mono text-xs text-cyan-300 break-all">{redirect}</span>
            </p>
          ) : (
            <p className="mt-3 text-amber-300">
              No redirect target was detected. If this page was opened manually, please launch login from the CLI again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
