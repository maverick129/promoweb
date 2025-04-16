export default function Terms() {
  const sections = [
    {
      title: 'Campaign Period',
      content: 'The Jiva Prodi Harvest Champions campaign runs from [Start Date] to [End Date]. All codes must be entered before the end date to be eligible for prizes.'
    },
    {
      title: 'Eligibility',
      content: 'The campaign is open to all farmers and agricultural workers in Indonesia who are 18 years of age or older. Employees of Jiva Prodi and their immediate family members are not eligible to participate.'
    },
    {
      title: 'How to Participate',
      content: 'To participate in the campaign, you must: 1) Register with your valid details, 2) Purchase Jiva Prodi products from authorized retailers, 3) Enter the unique promotion codes found on the products, and 4) Follow the instructions for prize claims.'
    },
    {
      title: 'Prize Details',
      content: 'Prizes include instant win items (T-shirts, caps, water bottles) and major raffle prizes (agricultural equipment). All prizes are non-transferable and cannot be exchanged for cash. Jiva Prodi reserves the right to substitute prizes of equal or greater value.'
    },
    {
      title: 'Code Validation',
      content: 'Each promotion code can only be used once. Codes must be entered exactly as they appear on the product packaging. Any attempt to use invalid, duplicated, or tampered codes will result in disqualification.'
    },
    {
      title: 'Prize Claim Process',
      content: 'Winners will be notified via SMS. To claim prizes, winners must present: 1) The winning code, 2) Valid government-issued ID, and 3) Proof of purchase. Prizes must be claimed within 30 days of winning.'
    },
    {
      title: 'Data Privacy',
      content: 'By participating in this campaign, you agree to the collection and use of your personal information for the purpose of administering the campaign and prize distribution. Your information will be handled in accordance with our Privacy Policy.'
    },
    {
      title: 'Limitations of Liability',
      content: 'Jiva Prodi is not responsible for: 1) Lost, late, or misdirected entries, 2) Technical failures or network issues, 3) Any injury or damage to participants or their property, or 4) Any other circumstances beyond our reasonable control.'
    },
    {
      title: 'Disqualification',
      content: 'Jiva Prodi reserves the right to disqualify any participant who: 1) Violates these terms and conditions, 2) Attempts to tamper with the entry process, 3) Engages in fraudulent activity, or 4) Acts in a manner that is disruptive or inappropriate.'
    },
    {
      title: 'Modifications',
      content: 'Jiva Prodi reserves the right to modify, suspend, or terminate the campaign at any time without prior notice. Any changes will be posted on the campaign website.'
    }
  ]

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Terms and Conditions
        </h1>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            Contact Information
          </h2>
          <p className="text-gray-600 mb-4">
            For any questions or concerns regarding these terms and conditions, please contact:
          </p>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> legal@jivaprodi.com
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> +62 123 456 7890
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Address:</span> Jl. Jiva Prodi No. 123, Jakarta, Indonesia
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 