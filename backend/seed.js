import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './models/Lead.js';
import User from './models/User.js';

dotenv.config();

const sampleLeads = [
  // --- This Month (July 2026) ---
  { name: 'Ali Hassan', company: 'TechNova Solutions', email: 'ali.hassan@technova.com', phone: '+91 9876543210', status: 'New', source: 'Website', notes: 'Interested in CRM integration', daysAgo: 1 },
  { name: 'Priya Sharma', company: 'CloudScale India', email: 'priya@cloudscale.in', phone: '+91 8765432109', status: 'Contacted', source: 'LinkedIn', notes: 'Follow up scheduled for next week', daysAgo: 2 },
  { name: 'Rahul Verma', company: 'DataDrive Analytics', email: 'rahul.v@datadrive.io', phone: '+91 7654321098', status: 'Meeting Scheduled', source: 'Referral', notes: 'Demo meeting on Friday', daysAgo: 3 },
  { name: 'Sneha Patel', company: 'FinEdge Technologies', email: 'sneha@finedge.com', phone: '+91 6543210987', status: 'Proposal Sent', source: 'Email Campaign', notes: 'Sent pricing proposal, awaiting response', daysAgo: 5 },
  { name: 'Vikram Singh', company: 'GreenLeaf Ventures', email: 'vikram@greenleaf.co', phone: '+91 5432109876', status: 'Won', source: 'Cold Call', notes: 'Closed deal - $15,000 annual contract', daysAgo: 6 },
  { name: 'Meera Reddy', company: 'QuantumBit Labs', email: 'meera.r@quantumbit.com', phone: '+91 4321098765', status: 'New', source: 'Website', notes: 'Downloaded whitepaper on AI solutions', daysAgo: 7 },
  { name: 'Arjun Nair', company: 'SwiftPay Systems', email: 'arjun@swiftpay.in', phone: '+91 3210987654', status: 'Lost', source: 'LinkedIn', notes: 'Went with competitor - price too high', daysAgo: 8 },
  { name: 'Fatima Khan', company: 'MedTech Innovations', email: 'fatima.k@medtech.com', phone: '+91 2109876543', status: 'Won', source: 'Referral', notes: 'Signed 2-year contract worth $28,000', daysAgo: 10 },

  // --- Last Month (June 2026) ---
  { name: 'Deepak Joshi', company: 'NexGen Robotics', email: 'deepak@nexgenbot.com', phone: '+91 9988776655', status: 'Won', source: 'Website', notes: 'Enterprise license deal', daysAgo: 20 },
  { name: 'Ananya Iyer', company: 'SkyBridge Telecom', email: 'ananya@skybridge.net', phone: '+91 8877665544', status: 'Contacted', source: 'Cold Call', notes: 'Interested but needs board approval', daysAgo: 25 },
  { name: 'Karthik Menon', company: 'EcoSmart Energy', email: 'karthik@ecosmart.in', phone: '+91 7766554433', status: 'Lost', source: 'Email Campaign', notes: 'Budget constraints this quarter', daysAgo: 28 },
  { name: 'Riya Gupta', company: 'UrbanNest Realty', email: 'riya@urbannest.com', phone: '+91 6655443322', status: 'Proposal Sent', source: 'LinkedIn', notes: 'Reviewing proposal with legal team', daysAgo: 30 },
  { name: 'Sanjay Kulkarni', company: 'ByteForge Studios', email: 'sanjay@byteforge.io', phone: '+91 5544332211', status: 'Won', source: 'Referral', notes: 'Closed - starter plan $8,500', daysAgo: 35 },

  // --- 2 Months Ago (May 2026) ---
  { name: 'Nisha Agarwal', company: 'BrightPath Education', email: 'nisha@brightpath.edu', phone: '+91 4433221100', status: 'Won', source: 'Website', notes: 'Education sector deal', daysAgo: 55 },
  { name: 'Rohan Desai', company: 'AquaPure Tech', email: 'rohan@aquapure.com', phone: '+91 3322110099', status: 'Lost', source: 'Cold Call', notes: 'Not a good fit for their needs', daysAgo: 60 },
  { name: 'Pooja Bansal', company: 'VirtuFit Health', email: 'pooja@virtufit.com', phone: '+91 2211009988', status: 'Contacted', source: 'Email Campaign', notes: 'Responded to email campaign', daysAgo: 65 },

  // --- 3 Months Ago (April 2026) ---
  { name: 'Amit Tiwari', company: 'LogiTrack Solutions', email: 'amit@logitrack.in', phone: '+91 1100998877', status: 'Won', source: 'LinkedIn', notes: 'Logistics management platform deal', daysAgo: 85 },
  { name: 'Kavita Rao', company: 'SilverLine Finance', email: 'kavita@silverline.com', phone: '+91 9090808070', status: 'Lost', source: 'Website', notes: 'Chose in-house solution', daysAgo: 90 },
  { name: 'Manish Dubey', company: 'CoreStack Infra', email: 'manish@corestack.io', phone: '+91 8080707060', status: 'Won', source: 'Referral', notes: 'Infrastructure monitoring deal', daysAgo: 95 },

  // --- 4 Months Ago (March 2026) ---
  { name: 'Swati Mishra', company: 'PeakView Analytics', email: 'swati@peakview.com', phone: '+91 7070606050', status: 'Won', source: 'Cold Call', notes: 'Analytics dashboard project', daysAgo: 115 },
  { name: 'Rajesh Pandey', company: 'BlueStar Logistics', email: 'rajesh@bluestar.in', phone: '+91 6060505040', status: 'Contacted', source: 'Email Campaign', notes: 'Multiple follow-ups done', daysAgo: 120 },

  // --- 5 Months Ago (February 2026) ---
  { name: 'Divya Saxena', company: 'NovaLabs AI', email: 'divya@novalabs.ai', phone: '+91 5050404030', status: 'Won', source: 'Website', notes: 'AI consulting contract', daysAgo: 145 },
  { name: 'Suresh Mohan', company: 'TrueNorth Media', email: 'suresh@truenorth.media', phone: '+91 4040303020', status: 'Lost', source: 'LinkedIn', notes: 'Timing not right, revisit Q3', daysAgo: 150 },
  { name: 'Lakshmi Venkat', company: 'ZenithWare Systems', email: 'lakshmi@zenithware.com', phone: '+91 3030202010', status: 'Won', source: 'Referral', notes: 'Long-term partnership signed', daysAgo: 155 },
];

const seedLeads = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the first user to use as owner
    const user = await User.findOne();
    if (!user) {
      console.error('No user found! Please register a user first.');
      process.exit(1);
    }

    console.log(`Using user: ${user.username} (${user.email}) as lead owner`);

    // Clear existing leads for this user
    await Lead.deleteMany({ owner: user._id });
    console.log('Cleared existing leads');

    // Create leads with proper dates
    const now = new Date();
    const leadsToInsert = sampleLeads.map(lead => {
      const createdAt = new Date(now.getTime() - lead.daysAgo * 24 * 60 * 60 * 1000);
      const { daysAgo, ...leadData } = lead;
      return {
        ...leadData,
        owner: user._id,
        createdAt,
        updatedAt: createdAt
      };
    });

    await Lead.insertMany(leadsToInsert);
    console.log(`Successfully seeded ${leadsToInsert.length} leads!`);
    
    // Print summary
    const statusCounts = {};
    leadsToInsert.forEach(l => {
      statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
    });
    console.log('\nStatus breakdown:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    await mongoose.connection.close();
    console.log('\nDone! Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedLeads();
