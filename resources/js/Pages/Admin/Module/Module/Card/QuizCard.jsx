import { showModalAtom } from '@/atoms'
import { WithAction } from '@/Components/Table'
import { DropdownMenuGroup, DropdownMenuItem } from '@/Components/ui/dropdown-menu'
import { ModalButton } from '@/Components/WithModal'
import { Link, usePage } from '@inertiajs/react'
import { useSetAtom } from 'jotai'
import { ClipboardCheck } from 'lucide-react'

function QuizCard({ quiz, lesson }) {
  const { module, page } = usePage().props
  const setShow = useSetAtom(showModalAtom)

  return (
    <div className="flex gap-2 items-center text-sm">
      <div className="flex items-center gap-1">
        <WithAction btnClassName={"px-2"} item={quiz} isTable={false} align="start" variant="shadcn" actionMenu={(data) => (
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href={`${page.url}/${module?.id}/lessons/${lesson?.id}/quizzes/${quiz.id}/questions`}>
                Daftar Pertanyaan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`${page.url}/${module?.id}/lessons/${lesson?.id}/quizzes/${quiz.id}/quiz_submissions`}>
                Lihat Submission
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ModalButton id={`quiz_form_${data?.id}`} onClick={() => setShow(data)}>
                Edit Kuis
              </ModalButton>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ModalButton id={`quiz_delete_${data?.id}`} onClick={() => setShow(data)}>
                Hapus Kuis
              </ModalButton>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )} />
        <ClipboardCheck className="w-4 h-4 text-emerald-600" strokeWidth={2} />
      </div>
      <div className="flex-none text-base">
        <Link href={`${page.url}/${module?.id}/lessons/${lesson?.id}/quizzes/${quiz.id}/questions`} className="hover:underline">
          <p className="max-w-[65vw] md:max-w-[77vw]">{quiz.title}</p>
        </Link>
      </div>
    </div>
  )
}

export default QuizCard