/**
 * Quote of the Day — deterministic daily rotation (local calendar day).
 * Educational investing mindset lines; not personalised advice.
 */
(function () {
  "use strict";

  /** @type {{ quote: string, author: string, note?: string }[]} */
  var QUOTES = [
    {
      quote: "The stock market is a device for transferring money from the impatient to the patient.",
      author: "Warren Buffett",
      note: "Time horizon often matters more than the next headline."
    },
    {
      quote: "Do not save what is left after spending, but spend what is left after saving.",
      author: "Warren Buffett",
      note: "Pay your future self first — SIPs automate that habit."
    },
    {
      quote: "Risk comes from not knowing what you are doing.",
      author: "Warren Buffett",
      note: "Read the product, costs, and exit rules before you click buy."
    },
    {
      quote: "Price is what you pay. Value is what you get.",
      author: "Warren Buffett",
      note: "A low price is not the same as a good investment."
    },
    {
      quote: "In the short run, the market is a voting machine. In the long run, it is a weighing machine.",
      author: "Benjamin Graham",
      note: "Noise fades; business results and cash flows weigh more over years."
    },
    {
      quote: "The individual investor should act consistently as an investor and not as a speculator.",
      author: "Benjamin Graham",
      note: "Speculation can be a hobby; goals need an investing plan."
    },
    {
      quote: "The four most dangerous words in investing are: ‘This time it’s different.’",
      author: "Sir John Templeton",
      note: "Cycles rhyme even when the story on TV sounds brand new."
    },
    {
      quote: "Bull markets are born on pessimism, grow on skepticism, mature on optimism, and die on euphoria.",
      author: "Sir John Templeton",
      note: "When everyone feels certain, check your risk, not your FOMO."
    },
    {
      quote: "An investment in knowledge pays the best interest.",
      author: "Benjamin Franklin",
      note: "A free hour with a good guide beats a hot tip."
    },
    {
      quote: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn’t, pays it.",
      author: "Often attributed to Albert Einstein",
      note: "Debt compounds against you; SIPs can compound for you."
    },
    {
      quote: "The goal of the nonprofessional should not be to pick winners… but to own a cross-section of businesses that in aggregate are bound to do well.",
      author: "Warren Buffett",
      note: "Broad equity funds and simple allocation beat stock-picking theatre for most people."
    },
    {
      quote: "Never invest in a business you cannot understand.",
      author: "Warren Buffett",
      note: "If you cannot explain it in plain language, size it small or skip it."
    },
    {
      quote: "The investor’s chief problem — and even his worst enemy — is likely to be himself.",
      author: "Benjamin Graham",
      note: "Panic sells and FOMO buys hurt more than a slightly imperfect portfolio."
    },
    {
      quote: "Know what you own, and know why you own it.",
      author: "Peter Lynch",
      note: "A one-line reason per holding beats a crowded watchlist."
    },
    {
      quote: "Go for a business that any idiot can run — because sooner or later, any idiot is probably going to run it.",
      author: "Peter Lynch",
      note: "Durable models matter more than a single star manager or founder story."
    },
    {
      quote: "Far more money has been lost by investors preparing for corrections, or trying to anticipate corrections, than has been lost in corrections themselves.",
      author: "Peter Lynch",
      note: "Sitting in cash “until it feels safe” has a cost too."
    },
    {
      quote: "Time is your friend; impulse is your enemy.",
      author: "John C. Bogle",
      note: "Index-style patience often beats clever timing."
    },
    {
      quote: "Don’t look for the needle in the haystack. Just buy the haystack!",
      author: "John C. Bogle",
      note: "Broad market exposure is enough for many long-term goals."
    },
    {
      quote: "The miracle of compounding returns is overwhelmed by the tyranny of compounding costs.",
      author: "John C. Bogle",
      note: "Expense ratios and frequent trading quietly eat decades of SIP."
    },
    {
      quote: "Investing should be more like watching paint dry or watching grass grow. If you want excitement, take $800 and go to Las Vegas.",
      author: "Paul Samuelson",
      note: "Boredom is often a feature of a good plan."
    },
    {
      quote: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
      author: "Philip Fisher",
      note: "Charts show price; your plan needs purpose and horizon."
    },
    {
      quote: "Wide diversification is only required when investors do not understand what they are doing.",
      author: "Warren Buffett",
      note: "For most people, sensible diversification is the understanding."
    },
    {
      quote: "Be fearful when others are greedy, and greedy when others are fearful.",
      author: "Warren Buffett",
      note: "Hard to do live — a written SIP and rebalancing rules help."
    },
    {
      quote: "Our favorite holding period is forever.",
      author: "Warren Buffett",
      note: "Not every asset is forever — but constant churn rarely is either."
    },
    {
      quote: "The individual investor has many advantages over the institution… if they can avoid herd behaviour.",
      author: "Paraphrase of common investor-education themes",
      note: "You do not have to match every trend on social media."
    },
    {
      quote: "A budget is telling your money where to go instead of wondering where it went.",
      author: "John C. Maxwell",
      note: "SIPs and EMIs both need room in the monthly cash flow."
    },
    {
      quote: "Do not put all your eggs in one basket.",
      author: "Proverb",
      note: "Diversify across assets and goals — not only across tips."
    },
    {
      quote: "A penny saved is a penny earned.",
      author: "Benjamin Franklin (popular form)",
      note: "Cutting a needless fee is a guaranteed ‘return’."
    },
    {
      quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Proverb",
      note: "Starting a small SIP beats waiting for the perfect entry."
    },
    {
      quote: "Fortune sides with those who dare — but only after they can afford to lose the dare.",
      author: "Investment Insights",
      note: "Take risk with surplus, not with next month’s rent."
    },
    {
      quote: "If you buy things you do not need, soon you will have to sell things you need.",
      author: "Often attributed to Warren Buffett",
      note: "Lifestyle creep is a silent tax on your corpus."
    },
    {
      quote: "Markets can remain irrational longer than you can remain solvent.",
      author: "John Maynard Keynes (popular form)",
      note: "Leverage and short horizons turn being ‘right eventually’ into ruin."
    },
    {
      quote: "In investing, what is comfortable is rarely profitable.",
      author: "Robert Arnott",
      note: "Comfort zones and crowded trades often travel together."
    },
    {
      quote: "The biggest risk of all is not taking one.",
      author: "Mellody Hobson",
      note: "All-cash forever has inflation risk; match risk to goals instead."
    },
    {
      quote: "How many millionaires do you know who have become wealthy by investing in savings accounts? I rest my case.",
      author: "Robert G. Allen (popular form)",
      note: "Savings accounts have a job — emergency money — not every long goal."
    },
    {
      quote: "An investment operation is one which, upon thorough analysis, promises safety of principal and an adequate return. Operations not meeting these requirements are speculative.",
      author: "Benjamin Graham",
      note: "Name your activity honestly: investing or speculation?"
    },
    {
      quote: "The intelligent investor is a realist who sells to optimists and buys from pessimists.",
      author: "Benjamin Graham",
      note: "Rebalancing forces a mild version of that discipline."
    },
    {
      quote: "Someone is sitting in the shade today because someone planted a tree a long time ago.",
      author: "Warren Buffett",
      note: "Retirement corpus is a tree you plant in your 20s–40s."
    },
    {
      quote: "You only have to do a very few things right in your life so long as you don’t do too many things wrong.",
      author: "Warren Buffett",
      note: "Avoid ruinous debt and concentrated gambles; keep the plan simple."
    },
    {
      quote: "The most important quality for an investor is temperament, not intellect.",
      author: "Warren Buffett",
      note: "Staying calm in drawdowns beats a clever spreadsheet."
    },
    {
      quote: "Diversification is protection against ignorance. It makes little sense if you know what you are doing.",
      author: "Warren Buffett",
      note: "Most households should diversify; concentration is a specialist sport."
    },
    {
      quote: "We simply attempt to be fearful when others are greedy and to be greedy only when others are fearful.",
      author: "Warren Buffett",
      note: "A SIP through fear is a practical form of that idea."
    },
    {
      quote: "The stock market is never obvious. It is designed to fool most of the people, most of the time.",
      author: "Jesse Livermore (popular form)",
      note: "If a tip feels effortless and urgent, slow down."
    },
    {
      quote: "There is nothing new in Wall Street. There can’t be, because speculation is as old as the hills.",
      author: "Jesse Livermore",
      note: "Bubbles and panics change costumes, not human nature."
    },
    {
      quote: "The elements of good trading are: cutting losses, cutting losses, and cutting losses.",
      author: "Ed Seykota (popular form)",
      note: "Trading needs exits; long-term investing needs patience — do not mix the two blindly."
    },
    {
      quote: "All you need is the plan, the roadmap, and the courage to press on to your destination.",
      author: "Earl Nightingale",
      note: "Write the goal, pick the SIP, and protect the emergency fund."
    },
    {
      quote: "Formal education will make you a living; self-education will make you a fortune.",
      author: "Jim Rohn (popular form)",
      note: "Learning products and behaviour pays longer than any single tip."
    },
    {
      quote: "Either you run the day or the day runs you.",
      author: "Jim Rohn",
      note: "Automate investments on salary day so the month does not ‘eat’ the SIP."
    },
    {
      quote: "Discipline is the bridge between goals and accomplishment.",
      author: "Jim Rohn",
      note: "A goal without a monthly debit order is a wish."
    },
    {
      quote: "Wealth is not about having a lot of money; it is about having a lot of options.",
      author: "Chris Rock (popular form)",
      note: "A corpus buys freedom of career and time — not only things."
    },
    {
      quote: "Never depend on a single income. Make investments to create a second source.",
      author: "Warren Buffett (popular form)",
      note: "Skills plus invested capital beat salary-only risk."
    },
    {
      quote: "It’s not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
      author: "Robert Kiyosaki (popular form)",
      note: "Fees, tax, and lifestyle inflation decide what you keep."
    },
    {
      quote: "A ship in harbour is safe, but that is not what ships are built for.",
      author: "John A. Shedd",
      note: "Some market risk is the price of long-term growth — take it knowingly."
    },
    {
      quote: "The future depends on what you do today.",
      author: "Mahatma Gandhi",
      note: "Today’s SIP is tomorrow’s optionality."
    },
    {
      quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
      author: "Mahatma Gandhi (popular form)",
      note: "Keep learning markets; keep living within a plan."
    },
    {
      quote: "It is not the man who has too little, but the man who craves more, that is poor.",
      author: "Seneca",
      note: "Enough is a financial goal too."
    },
    {
      quote: "Luck is what happens when preparation meets opportunity.",
      author: "Seneca (popular form)",
      note: "Cash buffer and skills turn surprises into options."
    },
    {
      quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      author: "Will Durant (on Aristotle)",
      note: "Monthly investing is a habit machine."
    },
    {
      quote: "The secret of getting ahead is getting started.",
      author: "Mark Twain (popular form)",
      note: "A small SIP started this month beats a perfect plan never funded."
    },
    {
      quote: "Whenever you find yourself on the side of the majority, it is time to pause and reflect.",
      author: "Mark Twain",
      note: "Crowded trades and media consensus deserve a second look."
    },
    {
      quote: "It takes 20 years to build a reputation and five minutes to ruin it.",
      author: "Warren Buffett",
      note: "One reckless leveraged bet can undo years of compounding."
    },
    {
      quote: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.",
      author: "Warren Buffett",
      note: "Avoid permanent loss: fraud, leverage blow-ups, and needless concentration."
    },
    {
      quote: "The stock market is a no-called-strike game. You don’t have to swing at everything.",
      author: "Warren Buffett",
      note: "Skipping bad ideas is a valid portfolio decision."
    },
    {
      quote: "You do not have to be brilliant, only a little bit wiser than the other guys, on average, for a long time.",
      author: "Charlie Munger",
      note: "Consistency beats brilliance without process."
    },
    {
      quote: "Invert, always invert: turn a situation or problem upside down. Look at it backward.",
      author: "Charlie Munger",
      note: "Ask: what would guarantee failure — then avoid those steps."
    },
    {
      quote: "A lot of success in life and business comes from knowing what you want to avoid.",
      author: "Charlie Munger",
      note: "Avoid high-interest consumer debt and products you do not understand."
    },
    {
      quote: "The big money is not in the buying and selling, but in the waiting.",
      author: "Charlie Munger",
      note: "Holding quality assets through boredom is underrated."
    },
    {
      quote: "Show me the incentive and I will show you the outcome.",
      author: "Charlie Munger",
      note: "Ask who earns a commission when a product is recommended."
    },
    {
      quote: "Spend each day trying to be a little wiser than when you woke up.",
      author: "Charlie Munger",
      note: "One term or page a day compounds like a SIP of knowledge."
    },
    {
      quote: "I never allow myself to have an opinion on anything that I don’t know the other side’s argument better than they do.",
      author: "Charlie Munger",
      note: "Before you buy, write the bear case in one paragraph."
    },
    {
      quote: "The first rule of compounding is to never interrupt it unnecessarily.",
      author: "Charlie Munger",
      note: "Needless switches and panic exits reset the clock."
    },
    {
      quote: "Opportunity comes to the prepared mind.",
      author: "Louis Pasteur (popular form)",
      note: "Emergency fund and a watchlist beat impulse when markets crack."
    },
    {
      quote: "Plans are worthless, but planning is everything.",
      author: "Dwight D. Eisenhower",
      note: "Update the plan when life changes; do not abandon planning."
    },
    {
      quote: "By failing to prepare, you are preparing to fail.",
      author: "Benjamin Franklin (popular form)",
      note: "Goals need amounts, dates, and a funding SIP — not only hope."
    },
    {
      quote: "Beware of little expenses; a small leak will sink a great ship.",
      author: "Benjamin Franklin",
      note: "Fees, unused subscriptions, and high EMIs are quiet leaks."
    },
    {
      quote: "He that is of the opinion money will do everything may well be suspected of doing everything for money.",
      author: "Benjamin Franklin",
      note: "Money is a tool for goals, not the goal itself."
    },
    {
      quote: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order.",
      author: "T.T. Munger (popular form)",
      note: "Automatic saving is character training with interest."
    },
    {
      quote: "Do not go broke for a tip that promised you would never go broke.",
      author: "Investment Insights",
      note: "If returns sound guaranteed and huge, walk away."
    },
    {
      quote: "Your emergency fund is not boring — it is the reason you can stay invested when life gets loud.",
      author: "Investment Insights",
      note: "Cash for shocks protects long-term equity SIPs."
    },
    {
      quote: "A high return you cannot sleep through is not a high return — it is a stress product.",
      author: "Investment Insights",
      note: "Match volatility to your horizon and nerves."
    },
    {
      quote: "Past performance is a rear-view mirror; goals live on the road ahead.",
      author: "Investment Insights",
      note: "Use history to set expectations, not as a promise."
    },
    {
      quote: "If you cannot explain the product to a friend in two minutes, you are not ready to buy it with next year’s school fees.",
      author: "Investment Insights",
      note: "Complexity is not sophistication."
    },
    {
      quote: "The market does not owe you a return because you need one for a goal.",
      author: "Investment Insights",
      note: "If the goal is near, reduce risk — do not hope harder."
    },
    {
      quote: "Diversification means always having to say you are sorry about something in the portfolio.",
      author: "Investment Insights",
      note: "Something will lag; that is often the point of balance."
    },
    {
      quote: "Tax is a cost of winning; unpaid tax surprises are a cost of not reading.",
      author: "Investment Insights",
      note: "Learn the basics of capital gains — then verify with a professional."
    },
    {
      quote: "Index funds are not ‘settling’ — they are refusing to pay extra for uncertainty that may not pay you back.",
      author: "Investment Insights",
      note: "Low cost is a rare free lunch in finance."
    },
    {
      quote: "Your asset allocation is your real stock pick.",
      author: "Investment Insights",
      note: "Equity vs debt mix drives risk more than fund logo colours."
    },
    {
      quote: "A SIP is a behaviour product first and a return product second.",
      author: "Investment Insights",
      note: "Automation beats motivation on busy months."
    },
    {
      quote: "Gold can be a diversifier; jewellery with high making charges is often a lifestyle purchase.",
      author: "Investment Insights",
      note: "Know which one you are buying."
    },
    {
      quote: "Real estate is a use asset and an investment — do the EMI math for both stories.",
      author: "Investment Insights",
      note: "House you live in is not only a return line on a spreadsheet."
    },
    {
      quote: "F&amp;O without a written max-loss rule is entertainment priced like education.",
      author: "Investment Insights",
      note: "Only risk money you can lose without touching goals."
    },
    {
      quote: "The best portfolio is the one you can hold through a bad year without rewriting your life plan.",
      author: "Investment Insights",
      note: "Survivability is a feature."
    },
    {
      quote: "Rebalancing feels wrong in the moment and right in the rear-view mirror.",
      author: "Investment Insights",
      note: "Selling winners to buy laggards is discipline, not betrayal."
    },
    {
      quote: "Credit card debt at high interest is a negative SIP you cannot afford.",
      author: "Investment Insights",
      note: "Clear toxic debt before fancy products."
    },
    {
      quote: "Insurance is not an investment; investments are not insurance.",
      author: "Investment Insights",
      note: "Mix-ups create expensive hybrid regrets."
    },
    {
      quote: "Your 20s buy time; your 40s buy top-ups; your 60s buy options — start early if you can.",
      author: "Investment Insights",
      note: "Compounding is a clock, not a slogan."
    },
    {
      quote: "A goal without a date is a dream; a date without a SIP is a deadline with stress.",
      author: "Investment Insights",
      note: "Use the goal planner to connect both."
    },
    {
      quote: "When friends boast returns, ask about fees, taxes, risk, and the money they lost on the way.",
      author: "Investment Insights",
      note: "Full stories beat highlight reels."
    },
    {
      quote: "Cash under the mattress has a silent partner: inflation.",
      author: "Investment Insights",
      note: "Emergency cash is necessary; all-cash forever is a choice with a cost."
    },
    {
      quote: "You do not need a hundred funds. You need a few you understand and fund every month.",
      author: "Investment Insights",
      note: "Simplicity scales; clutter does not."
    },
    {
      quote: "The market can teach patience faster than any book — if you stay enrolled.",
      author: "Investment Insights",
      note: "Staying invested is the tuition."
    },
    {
      quote: "A written investment policy for your household beats a genius prediction.",
      author: "Investment Insights",
      note: "Who invests, how much, when to rebalance, when to stop."
    },
    {
      quote: "Optimism is a good companion for work; realism is a better companion for portfolios.",
      author: "Investment Insights",
      note: "Plan for grey years, not only green ones."
    },
    {
      quote: "If the product needs a seminar dinner to sell, read the documents twice at home.",
      author: "Investment Insights",
      note: "Urgency and free gifts are sales tools."
    },
    {
      quote: "Your first investment is an emergency fund; your second is learning; your third can be a SIP.",
      author: "Investment Insights",
      note: "Order matters more than sophistication."
    },
    {
      quote: "Returns are uncertain. Costs, behaviour, and time horizon are somewhat in your control.",
      author: "Investment Insights",
      note: "Focus on the controllables."
    },
    {
      quote: "A bear market is a sale on future cash flows — if your job and emergency fund still work.",
      author: "Investment Insights",
      note: "Do not invent courage with money you need next year."
    },
    {
      quote: "Comparison is the thief of contentment and the enemy of compounding.",
      author: "Investment Insights",
      note: "Your neighbour’s portfolio is not your benchmark."
    },
    {
      quote: "Good advice is boring. Bad advice is exciting. Choose carefully which one you fund.",
      author: "Investment Insights",
      note: "Excitement is not a category on the riskometer."
    },
    {
      quote: "The rupee you do not send to fees is a rupee that can still compound for you.",
      author: "Investment Insights",
      note: "Compare direct vs regular and brokerage all-in costs."
    },
    {
      quote: "A portfolio is a set of promises to your future self — keep the ones you can keep.",
      author: "Investment Insights",
      note: "Under-promise SIPs you will actually run."
    },
    {
      quote: "When in doubt, reduce complexity before you increase risk.",
      author: "Investment Insights",
      note: "Fewer products, clearer goals."
    },
    {
      quote: "Markets reward patience in years and punish impatience in days.",
      author: "Investment Insights",
      note: "Match the scoreboard to the horizon."
    },
    {
      quote: "You cannot buy yesterday’s return at today’s price.",
      author: "Investment Insights",
      note: "Chasing last year’s winner is a common way to buy high."
    },
    {
      quote: "Risk is not a number on a slide — it is the chance you abandon the plan at the bottom.",
      author: "Investment Insights",
      note: "Design for stickiness."
    },
    {
      quote: "Save like a pessimist; invest like a cautious optimist.",
      author: "Investment Insights",
      note: "Buffers plus growth assets."
    },
    {
      quote: "The goal of investing is not to look clever at a party; it is to fund a life.",
      author: "Investment Insights",
      note: "Measure progress in goals funded, not tips collected."
    },
    {
      quote: "Every expert was once a beginner who kept a simple plan long enough.",
      author: "Investment Insights",
      note: "Start small, stay consistent, keep learning."
    },
    {
      quote: "Inflation is a thief that does not need to pick your pocket — it waits.",
      author: "Investment Insights",
      note: "Long rupee goals need growth assets in the mix."
    },
    {
      quote: "A SIP in a bad fund is still a SIP in a bad fund — review once a year, not once a day.",
      author: "Investment Insights",
      note: "Calm review beats constant tinkering."
    },
    {
      quote: "Leverage turns a lesson into a crisis.",
      author: "Investment Insights",
      note: "Prefer learning with money you can lose."
    },
    {
      quote: "Your allocation should survive both a bull market story and a bear market invoice.",
      author: "Investment Insights",
      note: "Stress-test with ‘what if equity is down 30%?’"
    },
    {
      quote: "The cheapest way to get rich slowly is still cheaper than getting poor quickly.",
      author: "Investment Insights",
      note: "Slow compounding beats fast ruin."
    },
    {
      quote: "Documents before dashboards. Process before predictions.",
      author: "Investment Insights",
      note: "KYC, nominations, and a written plan beat another price chart."
    },
    {
      quote: "If you would not buy it with money you just earned this month, do not buy it with money you might need next year.",
      author: "Investment Insights",
      note: "Source of funds reveals true risk."
    },
    {
      quote: "Peace of mind is an asset class. Price it when you choose products.",
      author: "Investment Insights",
      note: "Sleep is part of total return."
    },
    {
      quote: "The market is a tool. You are the operator. Tools do not care about your goals.",
      author: "Investment Insights",
      note: "You must bring the plan."
    },
    {
      quote: "Consistency is underrated because it does not trend on social media.",
      author: "Investment Insights",
      note: "Monthly SIPs are quietly powerful."
    },
    {
      quote: "Learn the difference between investing, trading, and gambling — then label your actions honestly.",
      author: "Investment Insights",
      note: "Honesty prevents accidental high risk."
    },
    {
      quote: "A long-term chart is a teacher; a one-day chart is a mood ring.",
      author: "Investment Insights",
      note: "Pick the timeframe that matches your goal."
    },
    {
      quote: "When everyone is a genius, check the cycle. When everyone is hopeless, check your SIP.",
      author: "Investment Insights",
      note: "Sentiment extremes are information, not instructions."
    },
    {
      quote: "Build the portfolio you can explain to your family in one page.",
      author: "Investment Insights",
      note: "If it needs a novel, simplify."
    },
    {
      quote: "Hope is not a hedge.",
      author: "Investment Insights",
      note: "Insurance, diversification, and cash buffers are."
    },
    {
      quote: "The best time to fix your allocation was last year. The second best time is your next salary credit.",
      author: "Investment Insights",
      note: "Act on the calendar you control."
    },
    {
      quote: "Wealth is built in boring months and protected in scary ones.",
      author: "Investment Insights",
      note: "Both phases need the same written plan."
    },
    {
      quote: "You are not late. You are here. Begin.",
      author: "Investment Insights",
      note: "Open the goal planner and fund the first SIP."
    }
  ];

  function dayNumberLocal() {
    var d = new Date();
    return Math.floor(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000
    );
  }

  function pickQuote() {
    if (!QUOTES.length) return null;
    // Offset vs term-of-day so the pair does not always feel "synced" from index 0
    var i = (dayNumberLocal() + 17) % QUOTES.length;
    if (i < 0) i += QUOTES.length;
    return { index: i, item: QUOTES[i], total: QUOTES.length };
  }

  function formatDateLabel() {
    try {
      return new Date().toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return new Date().toDateString();
    }
  }

  var escapeHtml =
    (window.IIUtil && window.IIUtil.escapeHtml) ||
    function (s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    };

  function render() {
    var root = document.getElementById("quote-of-day");
    if (!root) return;
    var picked = pickQuote();
    if (!picked) return;
    var q = picked.item;

    var quoteEl = document.getElementById("qod-quote");
    var authorEl = document.getElementById("qod-author");
    var noteEl = document.getElementById("qod-note");
    var dateEl = document.getElementById("qod-date");
    var metaEl = document.getElementById("qod-meta");

    if (quoteEl) quoteEl.textContent = q.quote;
    if (authorEl) authorEl.textContent = q.author ? "— " + q.author : "";
    if (noteEl) {
      if (q.note) {
        noteEl.innerHTML =
          "<strong>Takeaway:</strong> " + escapeHtml(q.note);
        noteEl.hidden = false;
      } else {
        noteEl.hidden = true;
      }
    }
    if (dateEl) dateEl.textContent = formatDateLabel();
    if (metaEl) {
      metaEl.textContent =
        "Quote " +
        (picked.index + 1) +
        " of " +
        picked.total +
        " · rotates daily · not advice";
    }
    root.setAttribute("data-quote-index", String(picked.index));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
