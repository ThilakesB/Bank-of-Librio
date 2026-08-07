export default function WelcomeHero({ onSetQuery }) {
  const suggestions = [
    {
      icon: "account_balance",
      label: "Search Bank Customer Balances",
      query: "Show me customer records with high balance in the bank dataset",
    },
    {
      icon: "menu_book",
      label: "Check Indexed Archives",
      query: "What document file types are indexed in ChromaDB?",
    },
    {
      icon: "description",
      label: "Document Summary",
      query: "Summarize key findings from the uploaded document",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center my-6 message-entrance">
      <div className="w-16 h-16 rounded-full bg-surface-variant border border-primary flex items-center justify-center text-primary mb-4 shadow-sm">
        <span className="material-symbols-outlined text-3xl">auto_awesome</span>
      </div>
      <h2 className="font-['Bodoni_Moda'] text-2xl lg:text-3xl font-semibold tracking-wide text-primary mb-2">
        Oracle of Libreo Archives
      </h2>
      <p className="text-on-surface-variant text-sm max-w-md font-['Source_Serif_4'] leading-relaxed">
        Query vector database, bank customer datasets (
        <code className="text-xs bg-surface-container px-1 py-0.5 rounded border border-outline-variant/40">
          BankCustomerData.csv
        </code>
        ), PDFs, spreadsheets, and document knowledge base powered by ChromaDB.
      </p>

      {/* Suggested Query Chips */}
      <div className="flex flex-wrap justify-center gap-2.5 mt-6">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSetQuery(s.query)}
            className="backdrop-blur-md border border-primary-container/60 hover:border-primary bg-surface-container/80 hover:bg-surface-container text-primary text-xs font-semibold px-4 py-2 rounded-md transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-secondary">
              {s.icon}
            </span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

