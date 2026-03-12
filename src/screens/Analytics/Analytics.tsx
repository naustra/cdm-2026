const DASHBOARD_URL =
  'https://metabase.plb-n8n.cloud/public/dashboard/0220c51e-e6c9-46a6-b5ff-56ac19859ad3'

const Analytics = () => {
  return (
    <div className="analytics-page">
      <iframe
        src={`${DASHBOARD_URL}#bordered=false&titled=true&theme=light`}
        width="100%"
        height="100%"
        style={{ border: 'none', minHeight: 'calc(100vh - 60px)' }}
        allowTransparency
      />
    </div>
  )
}

export default Analytics
