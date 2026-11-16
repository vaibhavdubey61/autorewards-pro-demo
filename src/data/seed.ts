import { User, QRCode, SKU, Transaction, RedemptionRequest, Reward, ScanEvent, Tier, BadgeType } from '../types'

export const DEFAULT_SKUS: SKU[] = [
  { id: 'sku-01', name: 'UltraBeam LED Headlights (H4/H7)', category: 'Lighting', dealerPoints: 150, fitterPoints: 100, warrantyMonths: 24, price: 3499 },
  { id: 'sku-02', name: 'Smoked LED Tail Lights Assembly', category: 'Lighting', dealerPoints: 200, fitterPoints: 150, warrantyMonths: 24, price: 5999 },
  { id: 'sku-03', name: 'All-Weather Laser Fog Lamps', category: 'Lighting', dealerPoints: 120, fitterPoints: 80, warrantyMonths: 18, price: 2799 },
  { id: 'sku-04', name: 'AeroFlex Silicone Wiper Blades (Pair)', category: 'Accessories', dealerPoints: 60, fitterPoints: 40, warrantyMonths: 12, price: 1199 },
  { id: 'sku-05', name: 'Premium Leatherette 3D Seat Covers', category: 'Interior', dealerPoints: 300, fitterPoints: 250, warrantyMonths: 36, price: 8499 },
  { id: 'sku-06', name: '7D Waterproof Diamond Floor Mats', category: 'Interior', dealerPoints: 220, fitterPoints: 180, warrantyMonths: 24, price: 4299 },
  { id: 'sku-07', name: 'Sport Grip Carbon Steering Cover', category: 'Interior', dealerPoints: 50, fitterPoints: 40, warrantyMonths: 12, price: 899 },
  { id: 'sku-08', name: 'Dual-Lens 4K Dash Cam with GPS', category: 'Electronics', dealerPoints: 350, fitterPoints: 300, warrantyMonths: 24, price: 9999 },
  { id: 'sku-09', name: 'Night-Vision AHD Reverse Camera', category: 'Electronics', dealerPoints: 140, fitterPoints: 120, warrantyMonths: 18, price: 2499 },
  { id: 'sku-10', name: 'Diamond-Cut Chrome Alloy Wheel Covers (Set of 4)', category: 'Exterior', dealerPoints: 180, fitterPoints: 100, warrantyMonths: 24, price: 3899 },
]

export const DEFAULT_REWARDS: Reward[] = [
  { id: 'rew-01', name: '₹500 Amazon Gift Voucher', description: 'Instant e-voucher sent via SMS/Email', pointsCost: 500, category: 'voucher', imageEmoji: '🛍️', isAvailable: true, minTier: 'Silver' },
  { id: 'rew-02', name: '₹1,000 Amazon Gift Voucher', description: 'Instant shopping voucher', pointsCost: 1000, category: 'voucher', imageEmoji: '🎁', isAvailable: true, minTier: 'Silver' },
  { id: 'rew-03', name: '₹2,500 Flipkart Gift Card', description: 'Redeemable on all Flipkart categories', pointsCost: 2500, category: 'voucher', imageEmoji: '💳', isAvailable: true, minTier: 'Gold' },
  { id: 'rew-04', name: '₹500 Instant UPI Transfer', description: 'Direct payout to your linked UPI ID', pointsCost: 550, category: 'upi', imageEmoji: '⚡', isAvailable: true, minTier: 'Silver' },
  { id: 'rew-05', name: '₹2,000 Direct Bank/UPI Transfer', description: 'Direct transfer processed within 2 hours', pointsCost: 2100, category: 'upi', imageEmoji: '🏦', isAvailable: true, minTier: 'Gold' },
  { id: 'rew-06', name: '₹299 Mobile Recharge (Jio/Airtel/Vi)', description: 'Unlimited monthly plan recharge', pointsCost: 300, category: 'recharge', imageEmoji: '📱', isAvailable: true, minTier: 'Silver' },
  { id: 'rew-07', name: 'Bosch 46-Piece Screwdriver & Ratchet Tool Kit', description: 'Professional automotive mechanical set', pointsCost: 1800, category: 'tools', imageEmoji: '🧰', isAvailable: true, minTier: 'Silver' },
  { id: 'rew-08', name: 'Stanley 12V Cordless Drill & Impact Driver', description: 'Heavy-duty installer power tool', pointsCost: 4500, category: 'tools', imageEmoji: '🔩', isAvailable: true, minTier: 'Gold' },
  { id: 'rew-09', name: 'Digital Automotive Multimeter & Circuit Tester', description: 'Precise car electrical diagnostic tool', pointsCost: 1200, category: 'tools', imageEmoji: '🔋', isAvailable: true, minTier: 'Silver' },
  { id: 'rew-10', name: '₹5,000 Fuel Prepaid Card (HPCL/IOCL)', description: 'Digital fuel card valid at all petrol bunks', pointsCost: 5000, category: 'voucher', imageEmoji: '⛽', isAvailable: true, minTier: 'Platinum' },
]

export const INDIAN_LOCATIONS = [
  { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'] },
  { state: 'Delhi', cities: ['New Delhi', 'North Delhi', 'South Delhi', 'Dwarka'] },
  { state: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'] },
  { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'] },
  { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'] },
  { state: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'] },
]

const DEALER_NAMES = [
  { first: 'Rajesh', last: 'Sharma', firm: 'Apex Auto Accessories' },
  { first: 'Amit', last: 'Patel', firm: 'Gujarat Car Decor' },
  { first: 'Suresh', last: 'Verma', firm: 'Delhi Motor Spares' },
  { first: 'Karthik', last: 'Rajan', firm: 'Chennai Auto Hub' },
  { first: 'Vikram', last: 'Singh', firm: 'Royal Car Care' },
  { first: 'Manoj', last: 'Joshi', firm: 'Pune Car Zone' },
  { first: 'Anand', last: 'Deshmukh', firm: 'Sai Auto World' },
  { first: 'Sunil', last: 'Agarwal', firm: 'Jaipur Auto Studio' },
  { first: 'Deepak', last: 'Mehta', firm: 'Surat Motor World' },
  { first: 'Praveen', last: 'Kumar', firm: 'Bangalore Speed Shop' },
  { first: 'Rakesh', last: 'Gupta', firm: 'Capital Car Spares' },
  { first: 'Sanjay', last: 'Rao', firm: 'Karnataka Motor Accessories' },
  { first: 'Naveen', last: 'Iyer', firm: 'Coimbatore Car Point' },
  { first: 'Mahesh', last: 'Chauhan', firm: 'Marwar Auto Agency' },
  { first: 'Alok', last: 'Trivedi', firm: 'Baroda Car Spa & Fitment' },
  { first: 'Girish', last: 'Bhat', firm: 'Mysore Auto Links' },
  { first: 'Pankaj', last: 'Kulkarni', firm: 'Thane Speed Car Care' },
  { first: 'Harish', last: 'Malhotra', firm: 'Grand Trunk Auto Store' },
  { first: 'Kunal', last: 'Bansal', firm: 'Pink City Motors' },
  { first: 'Gaurav', last: 'Singhal', firm: 'Metro Car Accessories' },
  { first: 'Virendra', last: 'Thakur', firm: 'Nagpur Drive Tech' },
  { first: 'Ramesh', last: 'Solanki', firm: 'Saurashtra Auto World' },
  { first: 'Venkatesh', last: 'Prabhu', firm: 'Coastline Auto Spares' },
  { first: 'Ajay', last: 'Soni', firm: 'Rajasthan Car Decorators' },
]

const FITTER_NAMES = [
  { first: 'Mohammed', last: 'Salim', firm: 'Star Fitters' },
  { first: 'Gopal', last: 'Yadav', firm: 'Yadav Electricals' },
  { first: 'Ravi', last: 'Chavan', firm: 'Chavan Auto Tech' },
  { first: 'Murugan', last: 'K', firm: 'Murugan Fitting Studio' },
  { first: 'Pradeep', last: 'Saini', firm: 'Speedy Fitments' },
  { first: 'Dinesh', last: 'Parmar', firm: 'Parmar Sound & Lights' },
  { first: 'Santosh', last: 'Gawde', firm: 'Santosh Car Fit' },
  { first: 'Bablu', last: 'Ansari', firm: 'Ansari Auto Experts' },
  { first: 'Manish', last: 'Pawar', firm: 'Power Auto Works' },
  { first: 'Saravanan', last: 'P', firm: 'Tamil Tech Installers' },
  { first: 'Jitendra', last: 'Rathore', firm: 'Rathore Wiring Hub' },
  { first: 'Brijesh', last: 'Tiwari', firm: 'Tiwari Auto Electric' },
  { first: 'Nilesh', last: 'Waghmare', firm: 'Nilesh Custom Fit' },
  { first: 'Imran', last: 'Khan', firm: 'Khan Auto Electricals' },
  { first: 'Chetan', last: 'Suthar', firm: 'Chetan Car Decor' },
  { first: 'Pooja', last: 'Nair', firm: 'Apex Female Fitters' },
  { first: 'Kailash', last: 'Sen', firm: 'Sen Sound & Accessories' },
  { first: 'Dilip', last: 'Barot', firm: 'Barot Install Works' },
  { first: 'Bhaskar', last: 'Naidu', firm: 'Silicon City Fitters' },
  { first: 'Ashok', last: 'Gurjar', firm: 'Gurjar Wiring Centre' },
  { first: 'Siddhesh', last: 'Kadam', firm: 'Kadam Car Tech' },
  { first: 'Muthu', last: 'Vel', firm: 'Vel Motor Fix' },
  { first: 'Iqbal', last: 'Sheikh', firm: 'Classic Car Studio' },
  { first: 'Lalit', last: 'Meena', firm: 'Meena Fitting Zone' },
]

export function calculateTier(points: number): Tier {
  if (points >= 5000) return 'Platinum'
  if (points >= 1000) return 'Gold'
  return 'Silver'
}

export function generateSeedData() {
  const users: User[] = []
  const qrCodes: QRCode[] = []
  const transactions: Transaction[] = []
  const redemptions: RedemptionRequest[] = []
  const scanEvents: ScanEvent[] = []

  // 1. Create Demo Dealer
  const demoDealer: User = {
    id: 'user-dealer-demo',
    mobile: '9876543210',
    role: 'dealer',
    firstName: 'Arun',
    lastName: 'Sharma',
    firmName: 'Sharma Auto World',
    email: 'dealer@autorewardspro.in',
    address: 'Plot 42, Link Road, Andheri West',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: '400053',
    points: 3450,
    lifetimePoints: 6200,
    redeemedPoints: 2750,
    pendingPoints: 0,
    tier: 'Gold',
    badges: ['first_scan', 'streak_7', 'top_dealer', 'century'],
    streakDays: 14,
    lastScanDate: new Date().toISOString(),
    monthlyTarget: 50,
    monthlyScans: 38,
    rank: 4,
    joinDate: '2026-01-15T09:00:00Z',
    isApproved: true,
    scratchCardsAvailable: 2,
    spinLastDate: undefined,
  }
  users.push(demoDealer)

  // 2. Create Demo Fitter
  const demoFitter: User = {
    id: 'user-fitter-demo',
    mobile: '9876543211',
    role: 'fitter',
    firstName: 'Raju',
    lastName: 'Mistry',
    firmName: 'Raju Speed Fitment Hub',
    email: 'fitter@autorewardspro.in',
    address: 'Gala No. 8, CST Road, Kurla',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: '400070',
    points: 2150,
    lifetimePoints: 3950,
    redeemedPoints: 1800,
    pendingPoints: 0,
    tier: 'Gold',
    badges: ['first_scan', 'streak_7', 'streak_30', 'speed_installer'],
    streakDays: 21,
    lastScanDate: new Date().toISOString(),
    monthlyTarget: 40,
    monthlyScans: 29,
    rank: 6,
    joinDate: '2026-02-01T10:00:00Z',
    isApproved: true,
    scratchCardsAvailable: 1,
    spinLastDate: undefined,
  }
  users.push(demoFitter)

  // 3. Create Demo Admin
  const demoAdmin: User = {
    id: 'user-admin-demo',
    mobile: '9999999999',
    role: 'admin',
    firstName: 'Super',
    lastName: 'Admin',
    firmName: 'AutoRewards Pro HQ',
    email: 'admin@autorewardspro.in',
    address: 'AutoRewards Tower, BKC',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: '400051',
    points: 0,
    lifetimePoints: 0,
    redeemedPoints: 0,
    pendingPoints: 0,
    tier: 'Platinum',
    badges: ['century', 'millennium'],
    streakDays: 0,
    monthlyTarget: 0,
    monthlyScans: 0,
    joinDate: '2025-12-01T00:00:00Z',
    isApproved: true,
    scratchCardsAvailable: 0,
  }
  users.push(demoAdmin)

  // 4. Generate 24 additional dealers (total 25)
  DEALER_NAMES.forEach((d, idx) => {
    const loc = INDIAN_LOCATIONS[idx % INDIAN_LOCATIONS.length]
    const city = loc.cities[idx % loc.cities.length]
    const lifetime = 1200 + ((idx * 373) % 7800)
    const redeemed = Math.floor(lifetime * 0.4)
    const points = lifetime - redeemed
    const tier = calculateTier(lifetime)
    const badges: BadgeType[] = ['first_scan']
    if (lifetime > 2000) badges.push('streak_7')
    if (lifetime > 4000) badges.push('century')
    if (idx < 3) badges.push('top_dealer')

    users.push({
      id: `dealer-${idx + 1}`,
      mobile: `98200${(10000 + idx).toString().slice(1)}`,
      role: 'dealer',
      firstName: d.first,
      lastName: d.last,
      firmName: d.firm,
      email: `${d.first.toLowerCase()}@${d.firm.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      address: `${10 + idx}, Auto Market, Main Commercial Road`,
      state: loc.state,
      city,
      pincode: `${400000 + (idx * 17) % 90000}`,
      points,
      lifetimePoints: lifetime,
      redeemedPoints: redeemed,
      pendingPoints: 0,
      tier,
      badges,
      streakDays: (idx * 3) % 25,
      monthlyTarget: 30 + (idx % 4) * 10,
      monthlyScans: 10 + (idx * 5) % 35,
      rank: idx + 1,
      joinDate: new Date(Date.now() - (90 - idx * 2) * 86400000).toISOString(),
      isApproved: true,
      scratchCardsAvailable: idx % 3,
    })
  })

  // 5. Generate 24 additional fitters (total 25)
  FITTER_NAMES.forEach((f, idx) => {
    const loc = INDIAN_LOCATIONS[idx % INDIAN_LOCATIONS.length]
    const city = loc.cities[idx % loc.cities.length]
    const lifetime = 900 + ((idx * 289) % 6400)
    const redeemed = Math.floor(lifetime * 0.35)
    const points = lifetime - redeemed
    const tier = calculateTier(lifetime)
    const badges: BadgeType[] = ['first_scan']
    if (lifetime > 1500) badges.push('streak_7')
    if (lifetime > 3000) badges.push('speed_installer')
    if (idx < 3) badges.push('top_fitter')

    users.push({
      id: `fitter-${idx + 1}`,
      mobile: `98300${(20000 + idx).toString().slice(1)}`,
      role: 'fitter',
      firstName: f.first,
      lastName: f.last,
      firmName: f.firm,
      email: `${f.first.toLowerCase()}@autofit.in`,
      address: `Shop ${20 + idx}, Station Road, Near Flyover`,
      state: loc.state,
      city,
      pincode: `${400000 + (idx * 23) % 90000}`,
      points,
      lifetimePoints: lifetime,
      redeemedPoints: redeemed,
      pendingPoints: 0,
      tier,
      badges,
      streakDays: (idx * 4) % 28,
      monthlyTarget: 25 + (idx % 3) * 10,
      monthlyScans: 8 + (idx * 4) % 28,
      rank: idx + 1,
      joinDate: new Date(Date.now() - (85 - idx * 2) * 86400000).toISOString(),
      isApproved: true,
      scratchCardsAvailable: (idx + 1) % 2,
    })
  })

  // 6. Generate 320 QR Codes with historical distribution over 90 days
  const vehicles = [
    { make: 'Maruti Suzuki', model: 'Brezza', year: '2023' },
    { make: 'Hyundai', model: 'Creta', year: '2024' },
    { make: 'Tata', model: 'Nexon', year: '2023' },
    { make: 'Mahindra', model: 'XUV700', year: '2024' },
    { make: 'Kia', model: 'Seltos', year: '2022' },
    { make: 'Toyota', model: 'Innova Crysta', year: '2023' },
    { make: 'Honda', model: 'City', year: '2021' },
    { make: 'Maruti Suzuki', model: 'Swift', year: '2024' },
  ]

  for (let i = 1; i <= 320; i++) {
    const sku = DEFAULT_SKUS[(i - 1) % DEFAULT_SKUS.length]
    const qrId = `ARP-QR-2026-${(1000 + i).toString().padStart(6, '0')}`

    let status: 'pending_dealer' | 'dealer_scanned' | 'fitter_scanned' = 'pending_dealer'
    let dealerScanBy: string | undefined = undefined
    let dealerScanAt: string | undefined = undefined
    let fitterScanBy: string | undefined = undefined
    let fitterScanAt: string | undefined = undefined
    let warrantyActivated = false
    let warrantyExpiry: string | undefined = undefined
    let customerName: string | undefined = undefined
    let customerMobile: string | undefined = undefined
    let vehicleNumber: string | undefined = undefined
    let vehicleMake: string | undefined = undefined
    let vehicleModel: string | undefined = undefined
    let vehicleYear: string | undefined = undefined
    let installationDate: string | undefined = undefined

    // Determine status distribution:
    // QRs 1-150: both dealer and fitter completed (fitter_scanned)
    // QRs 151-220: dealer scanned, pending fitter (dealer_scanned)
    // QRs 221-320: pristine new, unsealed (pending_dealer)
    const veh = vehicles[(i * 3) % vehicles.length]
    const daysAgo = Math.floor((320 - i) / 3.6) // distributed over 90 days
    const scanDate = new Date(Date.now() - daysAgo * 86400000 - (i % 24) * 3600000).toISOString()
    const expiryDate = new Date(Date.now() - daysAgo * 86400000 + sku.warrantyMonths * 30 * 86400000).toISOString().split('T')[0]

    // Link demo dealer to some codes so demo dealer has history!
    const dealerUser = (i % 7 === 0) ? demoDealer : users[1 + (i % 24)]
    const fitterUser = (i % 8 === 0) ? demoFitter : users[26 + (i % 24)]

    if (i <= 150) {
      status = 'fitter_scanned'
      dealerScanBy = dealerUser.id
      dealerScanAt = scanDate
      warrantyActivated = true
      warrantyExpiry = expiryDate
      customerName = `Customer ${i}`
      customerMobile = `98${(70000000 + i * 37).toString().slice(0, 8)}`
      vehicleNumber = `MH-02-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 3) % 26))}-${(1000 + (i * 17) % 8999)}`
      vehicleMake = veh.make
      vehicleModel = veh.model
      vehicleYear = veh.year
      fitterScanBy = fitterUser.id
      fitterScanAt = new Date(new Date(scanDate).getTime() + 1800000).toISOString() // 30 mins after
      installationDate = fitterScanAt.split('T')[0]

      // Push scan events
      scanEvents.push({
        id: `evt-d-${i}`,
        qrCodeId: qrId,
        userId: dealerUser.id,
        userName: `${dealerUser.firstName} ${dealerUser.lastName} (${dealerUser.firmName || 'Dealer'})`,
        step: 'dealer',
        timestamp: dealerScanAt,
        pointsEarned: sku.dealerPoints,
        skuName: sku.name,
      })

      scanEvents.push({
        id: `evt-f-${i}`,
        qrCodeId: qrId,
        userId: fitterUser.id,
        userName: `${fitterUser.firstName} ${fitterUser.lastName} (${fitterUser.firmName || 'Fitter'})`,
        step: 'fitter',
        timestamp: fitterScanAt,
        pointsEarned: sku.fitterPoints,
        skuName: sku.name,
      })

      // If demo dealer or fitter involved, add transactions
      if (dealerUser.id === demoDealer.id) {
        transactions.push({
          id: `tx-d-${i}`,
          userId: demoDealer.id,
          type: 'earned',
          points: sku.dealerPoints,
          description: `Dealer scan: ${sku.name} (#${qrId})`,
          qrCodeId: qrId,
          createdAt: dealerScanAt,
          status: 'completed',
        })
      }
      if (fitterUser.id === demoFitter.id) {
        transactions.push({
          id: `tx-f-${i}`,
          userId: demoFitter.id,
          type: 'earned',
          points: sku.fitterPoints,
          description: `Fitter installation: ${sku.name} (#${qrId})`,
          qrCodeId: qrId,
          createdAt: fitterScanAt,
          status: 'completed',
        })
      }
    } else if (i <= 220) {
      status = 'dealer_scanned'
      dealerScanBy = dealerUser.id
      dealerScanAt = scanDate
      warrantyActivated = true
      warrantyExpiry = expiryDate
      customerName = `Customer ${i}`
      customerMobile = `98${(70000000 + i * 37).toString().slice(0, 8)}`
      vehicleNumber = `DL-01-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 2) % 26))}-${(1000 + (i * 13) % 8999)}`
      vehicleMake = veh.make
      vehicleModel = veh.model
      vehicleYear = veh.year

      scanEvents.push({
        id: `evt-d-${i}`,
        qrCodeId: qrId,
        userId: dealerUser.id,
        userName: `${dealerUser.firstName} ${dealerUser.lastName} (${dealerUser.firmName || 'Dealer'})`,
        step: 'dealer',
        timestamp: dealerScanAt,
        pointsEarned: sku.dealerPoints,
        skuName: sku.name,
      })

      if (dealerUser.id === demoDealer.id) {
        transactions.push({
          id: `tx-d-${i}`,
          userId: demoDealer.id,
          type: 'earned',
          points: sku.dealerPoints,
          description: `Dealer scan: ${sku.name} (#${qrId})`,
          qrCodeId: qrId,
          createdAt: dealerScanAt,
          status: 'completed',
        })
      }
    } else {
      // Pristine unsealed QR codes ready for simulation / scanning
      status = 'pending_dealer'
    }

    qrCodes.push({
      id: qrId,
      skuId: sku.id,
      skuName: sku.name,
      productName: sku.name,
      status,
      dealerScanBy,
      dealerScanAt,
      fitterScanBy,
      fitterScanAt,
      warrantyActivated,
      warrantyExpiry,
      customerName,
      customerMobile,
      vehicleNumber,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      installationDate,
      dealerPoints: sku.dealerPoints,
      fitterPoints: sku.fitterPoints,
    })
  }

  // 7. Seed Redemptions
  redemptions.push(
    {
      id: 'red-01',
      userId: demoDealer.id,
      rewardId: 'rew-01',
      rewardName: '₹500 Amazon Gift Voucher',
      pointsCost: 500,
      status: 'fulfilled',
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 86400000).toISOString(),
      fulfillmentDetails: 'Voucher Code: AMZ-IN-8839-4412-8821',
    },
    {
      id: 'red-02',
      userId: demoDealer.id,
      rewardId: 'rew-05',
      rewardName: '₹2,000 Direct Bank/UPI Transfer',
      pointsCost: 2100,
      status: 'fulfilled',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 86400000 + 3600000).toISOString(),
      fulfillmentDetails: 'UPI UTR: 409928172615 to sharma@upi',
    },
    {
      id: 'red-03',
      userId: demoDealer.id,
      rewardId: 'rew-02',
      rewardName: '₹1,000 Amazon Gift Voucher',
      pointsCost: 1000,
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      fulfillmentDetails: 'Under verification by Admin',
    },
    {
      id: 'red-04',
      userId: demoFitter.id,
      rewardId: 'rew-07',
      rewardName: 'Bosch 46-Piece Screwdriver & Ratchet Tool Kit',
      pointsCost: 1800,
      status: 'fulfilled',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 13 * 86400000).toISOString(),
      fulfillmentDetails: 'Dispatched via BlueDart AWB #8472910394',
    },
    {
      id: 'red-05',
      userId: demoFitter.id,
      rewardId: 'rew-04',
      rewardName: '₹500 Instant UPI Transfer',
      pointsCost: 550,
      status: 'pending',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      fulfillmentDetails: 'Awaiting Admin Approval',
    }
  )

  // Add demo dealer redemption transactions
  transactions.push(
    {
      id: 'tx-red-01',
      userId: demoDealer.id,
      type: 'redeemed',
      points: 500,
      description: 'Redeemed: ₹500 Amazon Gift Voucher',
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      status: 'completed',
    },
    {
      id: 'tx-red-02',
      userId: demoDealer.id,
      type: 'redeemed',
      points: 2100,
      description: 'Redeemed: ₹2,000 Direct Bank/UPI Transfer',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      status: 'completed',
    },
    {
      id: 'tx-red-03',
      userId: demoDealer.id,
      type: 'bonus',
      points: 150,
      description: 'Daily Spin-the-Wheel bonus points',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'completed',
    }
  )

  return {
    users,
    qrCodes,
    skus: DEFAULT_SKUS,
    rewards: DEFAULT_REWARDS,
    transactions,
    redemptions,
    scanEvents,
  }
}
