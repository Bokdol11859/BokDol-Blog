import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <a className="mr-3 text-sm font-medium uppercase text-[#51abcb] hover:text-[#51abcb] dark:hover:text-[#51abcb]">
        {text.split(' ').join('-')}
      </a>
    </Link>
  )
}

export default Tag
