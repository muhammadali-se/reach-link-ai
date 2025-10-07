import { FormData } from '../types';

// Mock data for post generation by tone
const mockPostIdeas = {
  neutral: [
    `After 3 years in tech leadership, here are 5 lessons that changed how I work:

1. Clear communication beats technical brilliance
2. Your team's growth is your growth
3. Saying no is just as important as saying yes
4. Documentation saves more time than it takes
5. Culture isn't built in meetings, it's built in moments

Which resonates most with you?

#TechLeadership #CareerGrowth #TeamManagement`,

    `The skills that matter most for career growth in 2025:

Technical expertise will get you in the door, but these skills will accelerate your career:

→ Emotional intelligence
→ Clear communication
→ Strategic thinking
→ Adaptability to change
→ Building genuine relationships

The future belongs to well-rounded professionals who can bridge the gap between technology and people.

What skill are you focusing on this year?

#CareerDevelopment #ProfessionalGrowth #FutureOfWork`,

    `I changed my entire approach to team management last year.

The old way: Micromanaging tasks, tracking hours, measuring output.

The new way: Setting clear goals, building trust, enabling autonomy.

The result? Higher productivity, better morale, and more innovation.

Sometimes the best thing a leader can do is step back and let their team shine.

#Leadership #TeamManagement #WorkCulture`
  ],
  viral: [
    `🚨 The #1 mistake I see new developers make:

They learn to code, but forget to learn how to communicate.

You can write the most elegant code in the world, but if you can't explain your decisions, collaborate with your team, or present your ideas clearly, you'll struggle to grow.

The best developers I've worked with? They're great communicators first, great coders second.

Save this if you're starting your tech career.

#SoftwareDevelopment #CareerAdvice #TechCareers`,

    `Plot twist: The "soft skills" everyone ignores are the hardest to master.

Writing code? 6 months of practice.
Learning a framework? A few weeks.

But...

Leading a difficult conversation? Years.
Building genuine trust? A lifetime.
Managing your emotions under pressure? Still working on it.

The technical stuff is the easy part.

#CareerGrowth #ProfessionalDevelopment #Leadership`,

    `I was doing LinkedIn completely wrong for 3 years.

I thought it was about:
❌ Posting motivational quotes
❌ Humble bragging
❌ Sharing every certification

What actually works:
✅ Sharing real experiences
✅ Providing genuine value
✅ Building authentic connections

LinkedIn isn't social media. It's a platform for professionals to learn from each other.

Start treating it that way and watch what happens.

#LinkedIn #PersonalBrand #Networking`
  ],
  professional: [
    `Strategic insights from scaling our engineering team from 5 to 50:

→ Hire for adaptability over specific tech stacks
→ Invest in documentation before you think you need it
→ Build systems that can handle 10x growth
→ Culture compounds, both positive and negative
→ Communication overhead grows exponentially

The transition from startup to scale-up requires fundamentally different approaches to team building, architecture, and processes.

What's been your biggest lesson from rapid team growth?

#EngineeringLeadership #ScaleUp #TechManagement`,

    `Data-driven approaches to improving software delivery performance:

We reduced our deployment time by 60% using these metrics:

1. Lead time for changes
2. Deployment frequency
3. Mean time to recovery
4. Change failure rate

The key insight? Measuring what matters creates accountability and drives improvement.

We moved from monthly releases to daily deployments while simultaneously improving quality.

#DevOps #SoftwareEngineering #ContinuousImprovement`,

    `Leadership principles that drive sustainable growth in tech organizations:

→ Psychological safety enables innovation
→ Clear ownership reduces bottlenecks
→ Regular feedback loops accelerate learning
→ Technical debt must be balanced with feature velocity
→ Diverse perspectives lead to better solutions

Building a high-performing engineering culture isn't about ping pong tables or free snacks. It's about creating an environment where talented people can do their best work.

#TechLeadership #OrganizationalGrowth #EngineeringCulture`
  ],
  concise: [
    `3 rules for better code reviews:

1. Review for understanding, not perfection
2. Ask questions, don't make demands
3. Praise good solutions publicly

Better code reviews = better team culture.

#SoftwareEngineering #CodeReview #TeamWork`,

    `Remote work: 5 tools that changed everything

→ Loom for async updates
→ Notion for documentation
→ Linear for project tracking
→ Slack for quick questions
→ Zoom for face-to-face connection

The right tools make distance irrelevant.

#RemoteWork #Productivity #WorkFromHome`,

    `Why I quit my 6-figure job:

Money bought comfort.
But not fulfillment.

I was optimizing for the wrong metric.

Now I'm building something I believe in.

Best decision I ever made.

#CareerChange #Entrepreneurship #TakeTheLeap`
  ]
};

// Mock data for optimization by tone
const mockOptimizedPosts = {
  neutral: [
    `After 5 years in tech, here's what I've learned about success:

It's not just about coding skills.

The developers who advance fastest are the ones who can:
→ Communicate technical concepts clearly
→ Collaborate across teams effectively
→ Balance technical debt with feature delivery
→ Mentor others and share knowledge

Technical expertise opens doors. But communication and collaboration keep them open.

What's been your biggest career lesson?

#TechCareers #SoftwareEngineering #CareerGrowth`,

    `Building effective remote teams isn't about tools or processes.

It's about trust.

Here's what I discovered after 3 years of leading distributed teams:

→ Over-communicate by default
→ Document everything, assume nothing
→ Create intentional moments for connection
→ Respect time zones and work-life boundaries
→ Measure outcomes, not activity

Remote work isn't the future. It's the present. And teams that master it will have a competitive advantage.

#RemoteWork #TeamLeadership #DistributedTeams`,

    `I made a career pivot that changed everything.

From individual contributor to people manager. From writing code to enabling others to write better code.

The biggest adjustment? Learning that my success is now measured by my team's success.

It's less about what I can do, and more about what I can help others achieve.

If you're considering a move into leadership, prepare for a completely different kind of challenge.

#CareerGrowth #Leadership #TechManagement`
  ],
  viral: [
    `🚨 This career mistake cost me $50K (and years of growth)

I stayed too long in a comfortable role because I was afraid of failing somewhere new.

Here's what I learned:

→ Comfort is the enemy of growth
→ The best time to look for opportunities is when you don't need them
→ Your network is your net worth
→ Skills compound, titles don't

The opportunity cost of staying put is higher than the risk of moving forward.

Don't make the same mistake I did.

#CareerAdvice #ProfessionalGrowth #CareerDevelopment`,

    `Plot twist: Quitting my 6-figure job was the best decision I ever made.

Not because I was unhappy. The job was great. The people were amazing. The pay was comfortable.

But comfort was the problem.

I wasn't growing. I wasn't being challenged. I wasn't building toward something I believed in.

Two years later, I'm making less money but gaining more fulfillment than I ever thought possible.

Sometimes the scariest decision is the right one.

#CareerChange #Entrepreneurship #RiskTaking`,

    `I was doing LinkedIn completely wrong for 3 years.

What I was doing:
❌ Posting once a month
❌ Only sharing company updates
❌ Treating it like a digital resume

What actually works:
✅ Showing up consistently
✅ Sharing personal insights and lessons
✅ Engaging with others' content genuinely
✅ Building relationships, not just connections

LinkedIn isn't about perfection. It's about being real and providing value.

Start today. Your future self will thank you.

#LinkedIn #PersonalBrand #CareerGrowth`
  ],
  professional: [
    `Strategic lessons from transitioning to senior leadership:

The skills that got you here won't get you there.

As an individual contributor, success is about execution.
As a leader, success is about enablement.

Key transitions I had to make:

→ From solving problems to defining them
→ From being the expert to building expertise in others
→ From technical decisions to strategic direction
→ From individual impact to organizational impact

Leadership is a completely different skill set. Approach it with humility and a commitment to continuous learning.

#Leadership #CareerTransition #ExecutiveLeadership`,

    `How data-driven decision making transformed our engineering organization:

We stopped debating opinions and started measuring reality.

Key changes:

→ Implemented DORA metrics for deployment performance
→ Tracked cycle time from commit to production
→ Measured mean time to recovery for incidents
→ Analyzed code review velocity and quality

Results: 60% faster deployments, 40% fewer incidents, significantly higher team satisfaction.

When you measure what matters, improvement becomes inevitable.

#EngineeringExcellence #DataDriven #DevOps`,

    `Building sustainable growth requires balancing three priorities:

1. Shipping features customers need
2. Maintaining technical excellence
3. Developing team capabilities

Focus too much on features: technical debt accumulates.
Focus too much on perfection: business opportunities disappear.
Ignore team development: growth becomes impossible.

The best engineering leaders master this balance.

#TechLeadership #SustainableGrowth #EngineeringManagement`
  ],
  concise: [
    `Left my job. Started a company.

Why?

I wanted to build something meaningful.
I wanted to own my time.
I wanted to learn faster.

Scared? Absolutely.
Regrets? None.

#Entrepreneurship #StartupLife #CareerChange`,

    `5 years in tech. 3 key lessons:

1. Learn to communicate, not just code
2. Your network determines your opportunities
3. Consistency beats intensity

Simple, but not easy.

#TechCareers #CareerAdvice #ProfessionalGrowth`,

    `Remote work changed everything.

Commute time: 0 hours
Productivity: Up 40%
Work-life balance: Actually exists now

The office wasn't the asset.
Flexibility was.

#RemoteWork #FutureOfWork #WorkLifeBalance`
  ]
};

const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const fetchMockResults = async (data: FormData): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  const toneData = data.mode === 'generate' ? mockPostIdeas : mockOptimizedPosts;
  const selectedToneData = toneData[data.tone] || toneData.viral;

  return getRandomItems(selectedToneData, 3);
};