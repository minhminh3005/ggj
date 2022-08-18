import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { SerializedStyles } from '@emotion/react'
interface Props extends SvgIconProps {
  css?: SerializedStyles
}

export default function YahooIcon(props: Props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <defs>
        <pattern id="pattern" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 256 144">
          <image width="256" height="144" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAACQCAMAAADQvUWjAAAAM1BMVEUAAAD///////////////////////////////////////////////////////////////+3leKCAAAAEHRSTlMAQIAQ77+fMGDP3yCPcK9QYG35PAAABMVJREFUeF7tnemO4yAQhJv7Pt7/aVerlaLRRhmMUxAc8/2fgxJ0dzVg6N5sNpvNZrPZbDYbVsch6AKUOgxJV4DXYai7CxDpCqg6jHR3ARhdgbsnAbp7EqDsKhSvlIqcFxboMhjGo3pDB6Uy55wxZujSBGZ5VrL2IC2jr4MVrg/rYGklQgqEQjDuaxsZaCFSrT4anAbuavVurn+RuhAIPabeMwzKw3SK+iBbMU0BA9W1H/8QwNafuGTmKOBOLFUk7LWwPjKAAnjXxwZ5TlmfkboIgAJY1yOgC6Dd28k2jPWLsldjP8Ryxvoax83IbJg/5sHjcVl9LAAFMLmQD1gAZGoTqe05BSQ4F5YKgvWq6ukUpqmAE9RBUAoRBhSnHzh8l6pnemnqRTxcVz9S8RL+E7UeINNZ7Dhf2KvDY+z91ZUUNE4Bad50nyk2ZXDaGnpBHt2n1sgw0F8hycxZ40fBRXu/xHrcLo0OiMRisO0BfHsovFgCysA9C6AcAIWBdiKTiQ4gT0RAfDngBD7KqAAymHbGXromdJ7hdIg4qXeXmjJjx+8NzF+GOV1CaZDj1wJWqcZZu8lewMYvLW5mSjGtV55R43eGDgPI0LhUkDDj14IOE2AREJJxDKAAlBZqVBghSeD1pjunf78R0oRFIyecyK3p3wYUAXExJ74XVBO4PkuERrTqjkIHMR7gKHSrD4jHSMyuOZMIPyE/cFrNQmyRhcQrAy5MMO5Dn5q60sL/FRloDOpdWyRUa/lDjBCnQQj3Xj1kHKidEDDeBB8IvegMf3qERS8fvGqQ++ybHVGUqI8etec94Y/ROQSuDYIPhOxw+HBmSEKO1AO+IpThYPBQgs6SgSYAHwgdPWMl1K19+Byr7bZFEft/FmwExFeEtl39lFHWnNEMXE+b2Dj0dpIHt0HwG2ZO4MzfMwYeAfE9Qv1bwFBi2ApMy1w9tK+Xqx63AD3NIx8JA0IPqFPCGpf2hG+HAeFGpOk0ug0C2pqLg8ZPCtAGmbJVYF0j/aONEKfJ5NqJNCPrUC9oMsIDxo+TvdB0zAfGT3Klm1xp/vgLoA0CRM0eP8W1vtwg5OTxk4eaALwpGB2hzHLXeePc68YcEQHn58I4uhPB1v4qkyMUAdkGmXfZ2BCKNC8CAo9r6dEmPC3+TRZOKAS+DTJfALwRYvcRQCPaIHi6igC8EQrLC8CGZlxO9xEgAtoglxbAA0zGlQUwaBMwXwB8GWjuJIADuKwrCxAAJuDSAlhAhXFpATLAZl9ZAAFQ9toCRA+w2dcuhExykAg4XwAcwWaACZguABRRtAS0QaYKAIdFz64jgKUFWb8jtAXYAmwBtgBbgC3AFsBKzW4tgK+1+hhoYcRIAUr9h0vramBHCqA6vhS87BkZDmuEel0ErYauLTj0l7tYaCGCqgMFEHLx9w2CrgfQjAU6BV/aXxvuag9OKcU5T+y4Hn7NIzEUWIqqtmjrkblt5JeVvIXmf8lK+YojN3PgOvthdQT8xLlg/U3PdPITCTZ8kwCl/wCm+qpXKln/X2RfJUDovhzkv+uVyv4caL9KAEm/YFKWC73o+PKlxX9k3k9UkRqYpFZprz298jUNxh0gB16bkFyjCLqLBobuTEiaTrLZbDabzR/68z5DiuM/GgAAAABJRU5ErkJggg=="/>
        </pattern>
      </defs>
      <g id="グループ_2723" data-name="グループ 2723" transform="translate(21266 4569)">
        <rect id="長方形_1174" data-name="長方形 1174" width="24" height="24" rx="12" transform="translate(-21266 -4569)" fill="#f03"/>
        <g id="グループ_2725" data-name="グループ 2725" transform="translate(172 -9)">
          <rect id="yahoo_japan_icon_w_256" width="18" height="10" transform="translate(-21435 -4553)" fill="url(#pattern)"/>
          <rect id="長方形_1177" data-name="長方形 1177" width="18" height="18" transform="translate(-21435 -4557)" fill="none"/>
        </g>
      </g>
    </SvgIcon>
  )
}
