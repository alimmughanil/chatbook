import { CheckCircle, Circle, CirclePlay, CircleX, ClipboardCheck, File, FileText, Image, Link, Lock, NotepadText, PlayCircle } from "lucide-react"

export const AnswerCorrectIcon = ({ type }) => {
  type = type == 1 || type == true

  switch (type) {
    case true:
      return <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={2} />
    default:
      return <Circle className="w-4 h-4 text-gray-500" strokeWidth={2} />
  }
}

export const AnswerStatusIcon = ({ type }) => {
  switch (type) {
    case 'corrent':
      return <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={2} />
    case 'incorrent':
      return <CircleX className="w-4 h-4 text-red-600" strokeWidth={2} />
    default:
      return <Circle className="w-4 h-4 text-gray-500" strokeWidth={2} />
  }
}

export const LessonIcon = ({ type }) => {
  switch (type) {
    case "completed":
      return <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
    case "current":
      return <CirclePlay size={18} className="text-primary flex-shrink-0" />
    case "lock":
      return <Lock size={18} className="text-blue-600 flex-shrink-0" />
    default:
      return <Circle size={18} className="text-gray-400 flex-shrink-0" />
  }
}

export const LessonTypeIcon = ({ type }) => {
  switch (type) {
    case "video":
      return <PlayCircle className="w-8 h-8 text-purple-600" strokeWidth={2} />
    case "exam":
      return <ClipboardCheck className="w-8 h-8 text-emerald-600" strokeWidth={2} />
    case "lock":
      return <Lock className="w-8 h-8 text-blue-600" strokeWidth={2} />
    default:
      return <FileText className="w-8 h-8 text-gray-500" strokeWidth={2} />
  }
}

export const AttachmentContentType = ({ type }) => {  
  switch (type) {
    case "pdf":
      return <i className="fa fa-file-pdf"></i>
    case "word":
      return <NotepadText className="w-4 h-4 text-gray-500" strokeWidth={2} />
    case "image":
      return <Image className="w-4 h-4 text-gray-500" strokeWidth={2} />
    case "link":
      return <Link className="w-4 h-4 text-gray-500" strokeWidth={2} />
    default:
      return <File className="w-4 h-4 text-gray-500" strokeWidth={2} />
  }
}

export const QuizIcon = ({ type }) => {  
  switch (type) {
    case "graded":
      return <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
    case "submitted":
      return <CheckCircle size={18} className="text-primary flex-shrink-0" />
    default:
      return <Circle size={18} className="text-gray-400 flex-shrink-0" />
  }
}
