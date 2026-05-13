import { trends } from '@/data/fliqData';

function ExploreStrip() {
  return (
    <section className="explore-strip">
      <div>
        <span className="eyebrow">Explore</span>
        <h2>Pakistan-first discovery, global-ready conversations.</h2>
      </div>
      <div className="topic-grid">
        {['News', 'Cricket', 'Politics', 'Entertainment', 'Tech', 'Creators'].map((topic) => (
          <button type="button" key={topic}>#{topic}</button>
        ))}
      </div>
    </section>
  )
}

export default ExploreStrip
