import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, X, Download, Save } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as resumeService from '../services/resumeService';
import Loader from '../components/Loader';
import Card from '../components/Card';

const ResumeBuilder = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  const { register, control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      fullName: '', email: '', phone: '', address: '', summary: '',
      education: [], experience: [], skills: [], projects: [],
    },
  });

  const eduArray = useFieldArray({ control, name: 'education' });
  const expArray = useFieldArray({ control, name: 'experience' });
  const skillArray = useFieldArray({ control, name: 'skills' });
  const projArray = useFieldArray({ control, name: 'projects' });

  const formData = watch();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await resumeService.getMyResume();
        reset({
          ...res.resume,
          skills: res.resume.skills?.map((s) => ({ value: s })) || [],
        });
      } catch {
        toast.error('Failed to load resume');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = { ...data, skills: data.skills.map((s) => s.value).filter(Boolean) };
      await resumeService.saveResume(payload);
      toast.success('Resume saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.fullName || 'resume'}.pdf`);
      toast.success('Resume downloaded');
    } catch {
      toast.error('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Title */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl text-gray-900 dark:text-white">Resume Builder</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Build, save, and download your developer resume as a PDF.</p>
        </div>
        <button onClick={handleDownloadPDF} disabled={downloading} className="btn-primary">
          <Download className="h-4 w-4" /> {downloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        {/* Forms column */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Personal Info</h3>
            <div className="space-y-3">
              <input className="input-field" placeholder="Full Name" {...register('fullName')} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input className="input-field" placeholder="Email Address" {...register('email')} />
                <input className="input-field" placeholder="Phone Number" {...register('phone')} />
              </div>
              <input className="input-field" placeholder="Address" {...register('address')} />
              <textarea rows={3} className="input-field" placeholder="Professional Summary (Describe your background...)" {...register('summary')} />
            </div>
          </Card>

          <Card className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Education</h3>
              <button type="button" onClick={() => eduArray.append({ institution: '', degree: '', startYear: '', endYear: '' })} className="btn-secondary py-1.5 px-3 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add School
              </button>
            </div>
            <div className="space-y-4">
              {eduArray.fields.map((field, index) => (
                <div key={field.id} className="relative rounded-2xl border border-purple-50 dark:border-royal-darkBorder/40 p-4 bg-gray-50/20 dark:bg-royal-darkBg/10">
                  <button type="button" onClick={() => eduArray.remove(index)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field col-span-2" placeholder="Institution/School" {...register(`education.${index}.institution`)} />
                    <input className="input-field col-span-2" placeholder="Degree/Course" {...register(`education.${index}.degree`)} />
                    <input className="input-field" placeholder="Start Year" {...register(`education.${index}.startYear`)} />
                    <input className="input-field" placeholder="End Year" {...register(`education.${index}.endYear`)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Experience</h3>
              <button type="button" onClick={() => expArray.append({ company: '', role: '', startDate: '', endDate: '', description: '' })} className="btn-secondary py-1.5 px-3 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Job
              </button>
            </div>
            <div className="space-y-4">
              {expArray.fields.map((field, index) => (
                <div key={field.id} className="relative rounded-2xl border border-purple-50 dark:border-royal-darkBorder/40 p-4 bg-gray-50/20 dark:bg-royal-darkBg/10">
                  <button type="button" onClick={() => expArray.remove(index)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field" placeholder="Company Name" {...register(`experience.${index}.company`)} />
                    <input className="input-field" placeholder="Role/Title" {...register(`experience.${index}.role`)} />
                    <input className="input-field" placeholder="Start Date" {...register(`experience.${index}.startDate`)} />
                    <input className="input-field" placeholder="End Date" {...register(`experience.${index}.endDate`)} />
                  </div>
                  <textarea rows={2} className="input-field mt-3" placeholder="Job Responsibilities & Description" {...register(`experience.${index}.description`)} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Skills</h3>
              <button type="button" onClick={() => skillArray.append({ value: '' })} className="btn-secondary py-1.5 px-3 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Skill
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {skillArray.fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input className="input-field" placeholder="e.g. React.js" {...register(`skills.${index}.value`)} />
                  <button type="button" onClick={() => skillArray.remove(index)} className="rounded-xl border border-purple-50 p-2 text-red-500 hover:bg-red-50 hover:border-red-200 dark:border-royal-darkBorder dark:hover:bg-red-950/20 transition-all">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-purple-100 dark:border-royal-darkBorder bg-white dark:bg-royal-darkCard">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Projects</h3>
              <button type="button" onClick={() => projArray.append({ title: '', description: '', link: '' })} className="btn-secondary py-1.5 px-3 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Project
              </button>
            </div>
            <div className="space-y-4">
              {projArray.fields.map((field, index) => (
                <div key={field.id} className="relative rounded-2xl border border-purple-50 dark:border-royal-darkBorder/40 p-4 bg-gray-50/20 dark:bg-royal-darkBg/10">
                  <button type="button" onClick={() => projArray.remove(index)} className="absolute right-3 top-3 text-gray-400 hover:text-red-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                  <input className="input-field" placeholder="Project Title" {...register(`projects.${index}.title`)} />
                  <textarea rows={2} className="input-field mt-2" placeholder="Describe the project achievements" {...register(`projects.${index}.description`)} />
                  <input className="input-field mt-2" placeholder="Demo URL/Link (optional)" {...register(`projects.${index}.link`)} />
                </div>
              ))}
            </div>
          </Card>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3.5">
            <Save className="h-4.5 w-4.5" /> {saving ? 'Saving...' : 'Save Resume'}
          </button>
        </form>

        {/* Live Preview column */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">A4 Print Preview</h3>
          <div ref={previewRef} className="rounded-2xl bg-white p-8 shadow-lg text-gray-900 border border-purple-100" style={{ minHeight: '600px' }}>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">{formData.fullName || 'Your Name'}</h2>
            <p className="text-xs text-gray-500 font-semibold tracking-wide mt-1">
              {[formData.email, formData.phone, formData.address].filter(Boolean).join(' • ')}
            </p>
            
            {formData.summary && (
              <div className="mt-6">
                <h4 className="border-b-2 border-primary-600 pb-1 text-xs font-black uppercase tracking-wider text-primary-600">Summary</h4>
                <p className="mt-2 text-xs text-gray-700 leading-relaxed">{formData.summary}</p>
              </div>
            )}
            
            {formData.experience?.length > 0 && (
              <div className="mt-6">
                <h4 className="border-b-2 border-primary-600 pb-1 text-xs font-black uppercase tracking-wider text-primary-600">Experience</h4>
                {formData.experience.map((exp, i) => (
                  <div key={i} className="mt-3 text-xs">
                    <p className="font-bold text-gray-800">{exp.role} — <span className="text-primary-750 font-semibold">{exp.company}</span></p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{exp.startDate} - {exp.endDate}</p>
                    <p className="mt-1 text-gray-650 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {formData.education?.length > 0 && (
              <div className="mt-6">
                <h4 className="border-b-2 border-primary-600 pb-1 text-xs font-black uppercase tracking-wider text-primary-600">Education</h4>
                {formData.education.map((edu, i) => (
                  <div key={i} className="mt-3 text-xs">
                    <p className="font-bold text-gray-800">{edu.degree} — <span className="text-primary-750 font-semibold">{edu.institution}</span></p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{edu.startYear} - {edu.endYear}</p>
                  </div>
                ))}
              </div>
            )}

            {formData.skills?.length > 0 && (
              <div className="mt-6">
                <h4 className="border-b-2 border-primary-600 pb-1 text-xs font-black uppercase tracking-wider text-primary-600">Skills</h4>
                <p className="mt-2 text-xs text-gray-700 leading-relaxed">{formData.skills.map((s) => s.value).filter(Boolean).join(', ')}</p>
              </div>
            )}

            {formData.projects?.length > 0 && (
              <div className="mt-6">
                <h4 className="border-b-2 border-primary-600 pb-1 text-xs font-black uppercase tracking-wider text-primary-600">Projects</h4>
                {formData.projects.map((p, i) => (
                  <div key={i} className="mt-3 text-xs">
                    <p className="font-bold text-gray-800">{p.title}</p>
                    <p className="mt-1 text-gray-650 leading-relaxed">{p.description}</p>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-[10px] text-primary-600 font-bold block mt-1 hover:underline">{p.link}</a>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ResumeBuilder;
