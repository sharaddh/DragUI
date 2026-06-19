// app/page.tsx  (or wherever you want to use it)
import Generate from '../components/Generate';

export default function Home() {
  return (
    <Generate
      accentColor="#6366F1"   // indigo
      dark={false}
      onThemeToggle={() => console.log('Theme toggled')}
    />
  );
}