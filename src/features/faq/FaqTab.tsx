import { faq } from '../../data/faq'
import { tabHref } from '../../lib/tabHref'
import './FaqTab.css'

export function FaqTab() {
  return (
    <section>
      <h2 className="faq-tab__title">Questions &amp; answers</h2>
      <p className="faq-tab__subtitle">Tap a question to see the answer.</p>
      <div className="faq-tab__list">
        {faq.map((item) => (
          <details key={item.id} className="faq-tab__item">
            <summary className="faq-tab__question">{item.question}</summary>
            <p className="faq-tab__answer">{item.answer}</p>
            {item.link && (
              <a className="faq-tab__link" href={tabHref(item.link.tabId)}>
                {item.link.label}
              </a>
            )}
          </details>
        ))}
      </div>
    </section>
  )
}
