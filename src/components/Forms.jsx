import { useEffect, useMemo, useState } from 'react'

const OPERATOR_TYPES = ["Onrole", "Apprentices"]
const TEST_TYPES = ["HV", "FT"]
const HV_STATIONS = ["HSPA-27","HSPA-23","HSPA-2","HSPA-1","HSPA-24"]
const FT_STATIONS = ["WUPS-1","WUPS-2","WUPS-3","WUPS-6","7SR5","AFT2"]
const DEVICES = [
  "RC E4","RC E4 EXT","RM E6","RM E6 EXT","RM E8","RM E8 EXT","RM E10","RM E10 EXT","RM E12","RM 12 EXT",
  "7SJ66 1/2","7SJ66 1/3","7SR10","7SR45","7SR46","7SR5 S6","7SR5 S8","7SR5 12","SIP4 1/6","SIP4 1/1","SIP4 1/2","SIP4 1/3","7SR119"
]

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, children }) {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-blue-500/10 p-4">
      <h3 className="text-blue-100 font-semibold mb-2">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="text-blue-200 text-sm">
      <span className="block mb-1">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-900/60 border border-slate-700 text-blue-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  )
}

function Input({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="text-blue-200 text-sm">
      <span className="block mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900/60 border border-slate-700 text-blue-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
      />
    </label>
  )
}

function DateTime({ label, value, onChange }) {
  return (
    <label className="text-blue-200 text-sm">
      <span className="block mb-1">{label}</span>
      <input
        type="datetime-local"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-900/60 border border-slate-700 text-blue-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  )
}

function SubmitBar({ onSubmit, disabled, label = 'Submit' }) {
  return (
    <div className="flex justify-end">
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold"
      >
        {label}
      </button>
    </div>
  )
}

export function ProductionForm() {
  const [operatorName, setOperatorName] = useState('')
  const [operatorId, setOperatorId] = useState('')
  const [operatorType, setOperatorType] = useState('')
  const [testType, setTestType] = useState('')
  const [testStation, setTestStation] = useState('')
  const [deviceType, setDeviceType] = useState('')
  const [count, setCount] = useState('')
  const [dt, setDt] = useState(() => new Date().toISOString().slice(0,16))
  const [status, setStatus] = useState(null)

  const stationOptions = useMemo(() => {
    if (testType === 'HV') return HV_STATIONS
    if (testType === 'FT') return FT_STATIONS
    return []
  }, [testType])

  useEffect(() => {
    setTestStation('')
  }, [testType])

  const submit = async () => {
    setStatus('Saving...')
    try {
      const payload = {
        operator_name: operatorName,
        operator_id: operatorId,
        operator_type: operatorType,
        test_type: testType,
        test_station: testStation,
        device_type: deviceType,
        production_count: Number(count || 0),
        timestamp: new Date(dt).toISOString()
      }
      const res = await fetch(`${baseUrl}/api/production`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setStatus(`Submitted to ${data.shift} shift`)
      // reset count only
      setCount('')
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    }
  }

  const disabled = !operatorName || !operatorId || !operatorType || !testType || !testStation || !deviceType || !count || !dt

  return (
    <div className="space-y-4">
      <Section title="Operator name">
        <Input label="Name" value={operatorName} onChange={setOperatorName} placeholder="Enter operator name" />
      </Section>
      <Section title="Operator ID">
        <Input label="ID" value={operatorId} onChange={setOperatorId} placeholder="Enter operator ID" />
      </Section>
      <Section title="Operator type">
        <Select label="Type" value={operatorType} onChange={setOperatorType} options={OPERATOR_TYPES} />
      </Section>
      <Section title="Type of testing">
        <Select label="Testing" value={testType} onChange={setTestType} options={TEST_TYPES} />
      </Section>
      <Section title="Test station">
        <Select label="Station" value={testStation} onChange={setTestStation} options={stationOptions} />
      </Section>
      <Section title="Device type">
        <Select label="Device" value={deviceType} onChange={setDeviceType} options={DEVICES} />
      </Section>
      <Section title="Production count and Date/Time">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Production Count" type="number" value={count} onChange={setCount} placeholder="0" />
          <DateTime label="Date & Time" value={dt} onChange={setDt} />
        </div>
      </Section>
      <SubmitBar onSubmit={submit} disabled={disabled} />
      {status && <p className="text-blue-200 text-sm">{status}</p>}
    </div>
  )
}

export function PackingForm() {
  const [operatorName, setOperatorName] = useState('')
  const [deviceType, setDeviceType] = useState('')
  const [operatorType, setOperatorType] = useState('')
  const [jobType, setJobType] = useState('')
  const [count, setCount] = useState('')
  const [dt, setDt] = useState(() => new Date().toISOString().slice(0,16))
  const [status, setStatus] = useState(null)

  const submit = async () => {
    setStatus('Saving...')
    try {
      const payload = {
        operator_name: operatorName,
        device_type: deviceType,
        operator_type: operatorType,
        job_type: jobType,
        packing_count: Number(count || 0),
        timestamp: new Date(dt).toISOString()
      }
      const res = await fetch(`${baseUrl}/api/packing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setStatus(`Submitted to ${data.shift} shift`)
      setCount('')
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    }
  }

  const disabled = !operatorName || !deviceType || !operatorType || !jobType || !count || !dt

  return (
    <div className="space-y-4">
      <Section title="Operator name">
        <Input label="Name" value={operatorName} onChange={setOperatorName} placeholder="Enter operator name" />
      </Section>
      <Section title="Device type">
        <Select label="Device" value={deviceType} onChange={setDeviceType} options={DEVICES} />
      </Section>
      <Section title="Operator type">
        <Select label="Type" value={operatorType} onChange={setOperatorType} options={OPERATOR_TYPES} />
      </Section>
      <Section title="Job type">
        <Input label="Job Type" value={jobType} onChange={setJobType} placeholder="Enter job type" />
      </Section>
      <Section title="Packing count and Date/Time">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Packing Count" type="number" value={count} onChange={setCount} placeholder="0" />
          <DateTime label="Date & Time" value={dt} onChange={setDt} />
        </div>
      </Section>
      <SubmitBar onSubmit={submit} disabled={disabled} label="Submit" />
      {status && <p className="text-blue-200 text-sm">{status}</p>}
    </div>
  )
}

export function DowntimeForm() {
  const [operatorName, setOperatorName] = useState('')
  const [description, setDescription] = useState('')
  const [dt, setDt] = useState(() => new Date().toISOString().slice(0,16))
  const [status, setStatus] = useState(null)

  const submit = async () => {
    setStatus('Saving...')
    try {
      const payload = {
        operator_name: operatorName,
        description,
        timestamp: new Date(dt).toISOString()
      }
      const res = await fetch(`${baseUrl}/api/downtime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      setStatus(`Submitted to ${data.shift} shift`)
      setDescription('')
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    }
  }

  const disabled = !operatorName || !description || !dt

  return (
    <div className="space-y-4">
      <Section title="Operator name">
        <Input label="Name" value={operatorName} onChange={setOperatorName} placeholder="Enter operator name" />
      </Section>
      <Section title="Downtime description">
        <label className="text-blue-200 text-sm">
          <span className="block mb-1">Description</span>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-slate-900/60 border border-slate-700 text-blue-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </Section>
      <Section title="Date & Time">
        <DateTime label="Date & Time" value={dt} onChange={setDt} />
      </Section>
      <SubmitBar onSubmit={submit} disabled={disabled} label="Submit" />
      {status && <p className="text-blue-200 text-sm">{status}</p>}
    </div>
  )
}
