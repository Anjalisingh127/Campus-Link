import { useState } from 'react';

const categories = ['technical', 'cultural', 'sports', 'workshop', 'seminar', 'other'];
const statuses = ['published', 'draft', 'cancelled'];

function validate(values) {
  const errors = {};
  if (values.title.trim().length < 3) errors.title = 'Enter at least 3 characters.';
  if (values.description.trim().length < 10) errors.description = 'Enter at least 10 characters.';
  if (!values.organizer.trim()) errors.organizer = 'Organizer is required.';
  if (!values.venue.trim()) errors.venue = 'Venue is required.';
  if (!values.eventDate || Number.isNaN(Date.parse(values.eventDate))) errors.eventDate = 'Choose a valid date and time.';
  if (values.registrationUrl) {
    try {
      const url = new URL(values.registrationUrl);
      if (!['http:', 'https:'].includes(url.protocol)) errors.registrationUrl = 'Use an HTTP or HTTPS URL.';
    } catch {
      errors.registrationUrl = 'Enter a valid registration URL.';
    }
  }
  if (values.tags.split(',').filter((tag) => tag.trim()).length > 10) errors.tags = 'Add no more than 10 tags.';
  return errors;
}

export function EventForm({ initialValues, onSubmit, submitLabel, workingLabel }) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState({ working: false, error: '' });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitState({ working: true, error: '' });
    try {
      await onSubmit({
        ...form,
        eventDate: new Date(form.eventDate).toISOString(),
        registrationUrl: form.registrationUrl.trim(),
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
    } catch (error) {
      if (error.details?.length) {
        setErrors(Object.fromEntries(error.details.map((detail) => [detail.field, detail.message])));
      }
      setSubmitState({ working: false, error: error.message });
    }
  }

  return (
    <form className="event-form" onSubmit={handleSubmit} noValidate>
      {submitState.error && <div className="form-alert" role="alert">{submitState.error}</div>}
      <div className="form-grid">
        <FormField label="Title" name="title" value={form.title} error={errors.title} onChange={updateField} maxLength="120" />
        <SelectField label="Category" name="category" value={form.category} onChange={updateField} options={categories} />
        <FormField className="full-field" label="Description" name="description" value={form.description} error={errors.description} onChange={updateField} as="textarea" maxLength="2000" />
        <FormField label="Organizer" name="organizer" value={form.organizer} error={errors.organizer} onChange={updateField} maxLength="120" />
        <FormField label="Venue" name="venue" value={form.venue} error={errors.venue} onChange={updateField} maxLength="160" />
        <FormField label="Event date and time" name="eventDate" type="datetime-local" value={form.eventDate} error={errors.eventDate} onChange={updateField} />
        <SelectField label="Status" name="status" value={form.status} onChange={updateField} options={statuses} />
        <FormField className="full-field" label="Registration URL (optional)" name="registrationUrl" type="url" value={form.registrationUrl} error={errors.registrationUrl} onChange={updateField} maxLength="500" />
        <FormField className="full-field" label="Tags (comma separated)" name="tags" value={form.tags} error={errors.tags} onChange={updateField} placeholder="cloud, workshop, careers" />
      </div>
      <div className="form-actions">
        <a className="secondary-link" href="#/events">Cancel</a>
        <button className="primary-button" type="submit" disabled={submitState.working}>{submitState.working ? workingLabel : submitLabel}</button>
      </div>
    </form>
  );
}

function FormField({ label, name, value, error, onChange, as = 'input', className = '', ...inputProps }) {
  const id = `event-${name}`;
  const Component = as;
  return (
    <label className={`form-field ${className}`} htmlFor={id}>
      <span>{label}</span>
      <Component id={id} name={name} value={value} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...inputProps} />
      {error && <small id={`${id}-error`}>{error}</small>}
    </label>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="form-field" htmlFor={`event-${name}`}>
      <span>{label}</span>
      <select id={`event-${name}`} name={name} value={value} onChange={onChange}>
        {options.map((option) => <option key={option} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>)}
      </select>
    </label>
  );
}
