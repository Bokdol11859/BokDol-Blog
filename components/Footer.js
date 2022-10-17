import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import { SocialIcon } from 'react-social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon
            url={siteMetadata.github}
            href={siteMetadata.github}
            size="6"
            fgColor="gray"
            bgColor="transparent"
          />
          <SocialIcon
            url={siteMetadata.instagram}
            href={siteMetadata.instagram}
            size="6"
            fgColor="gray"
            bgColor="transparent"
          />
          <SocialIcon
            url={siteMetadata.linkedin}
            href={siteMetadata.linkedin}
            size="6"
            fgColor="gray"
            bgColor="transparent"
          />
        </div>
        <div className="mb-2 flex space-x-2 text-xs text-gray-500 dark:text-gray-400 md:text-lg">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
