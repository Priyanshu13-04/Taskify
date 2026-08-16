import React from "react"

import {
  Check,
  CalendarDays,
  CircleCheck,
  Inbox,
  Plus,
  Settings,
  CircleHelp,
  LogOut,
  Sun,
  X,
} from "lucide-react"


const LeftBar = ({
  tasks,
  activeFilter,
  selectedCategory,
  onFilterChange,
  onCategoryChange,
  onClose,
}) => {

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = [
    {
      name: "Work",
      color: "bg-blue-500",
    },
    {
      name: "Personal",
      color: "bg-green-500",
    },
    {
      name: "Study",
      color: "bg-purple-500",
    },
    {
      name: "Health",
      color: "bg-orange-500",
    },
    {
      name: "Finance",
      color: "bg-yellow-400",
    },
  ]


  // ==========================================
  // CATEGORY COUNT
  // ==========================================

  const getCategoryCount = (category) => {
    return tasks.filter(
      (task) =>
        task.category === category
    ).length
  }


  // ==========================================
  // NAV ITEM
  // ==========================================

  const navItem = (name, icon) => {

    const active =
      activeFilter === name ||
      (
        name === "All Tasks" &&
        activeFilter === "All"
      )

    return (
      <div
        onClick={() => {

          onFilterChange(
            name === "All Tasks"
              ? "All"
              : name
          )

          onClose?.()
        }}
        className={`
          flex
          items-center
          gap-4
          rounded-2xl
          p-2.5
          pl-4
          cursor-pointer
          transition
          hover:bg-gradient-to-br
          hover:from-cyan-500
          hover:to-blue-600

          ${
            active
              ? "bg-gray-700 text-white"
              : "text-gray-300"
          }
        `}
      >

        {icon}

        <span>
          {name}
        </span>

      </div>
    )
  }


  return (

    <div
      className="
        relative
        m-3
        flex
        h-[calc(100vh-24px)]
        min-h-[600px]
        w-[260px]
        max-w-[calc(100vw-24px)]
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-slate-600
        bg-gray-900
      "
    >

      {/* ======================================
          MOBILE CLOSE BUTTON
      ====================================== */}

      <button
        type="button"
        aria-label="Close sidebar"
        onClick={() =>
          onClose?.()
        }
        className="
          absolute
          right-3
          top-3
          z-10
          flex
          h-8
          w-8
          cursor-pointer
          items-center
          justify-center
          rounded-lg
          text-gray-400
          transition
          hover:bg-gray-800
          hover:text-white
          lg:hidden
        "
      >
        <X size={18} />
      </button>


      {/* ======================================
          LOGO
      ====================================== */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-2
          p-3
          pl-7
          text-2xl
          font-bold
          text-white
          sm:ml-3
          sm:mt-1
        "
      >

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-around
            rounded-full
            bg-gradient-to-br
            from-cyan-300
            to-blue-600
          "
        >

          <Check
            size={20}
            strokeWidth={3}
          />

        </div>

        <span>
          Taskify
        </span>

      </div>


      {/* ======================================
          NAVIGATION
      ====================================== */}

      <div
        className="
          shrink-0
          cursor-pointer
          p-2
          text-gray-300
        "
      >

        {navItem(
          "My Tasks",
          <Check size={18} />
        )}

        {navItem(
          "Today",
          <Sun size={18} />
        )}

        {navItem(
          "Upcoming",
          <CalendarDays size={18} />
        )}

        {navItem(
          "Completed",
          <CircleCheck size={18} />
        )}

        {navItem(
          "All Tasks",
          <Inbox size={18} />
        )}

      </div>


      {/* ======================================
          DIVIDER
      ====================================== */}

      <div className="mx-2 shrink-0 border-t border-gray-600" />


      {/* ======================================
          CATEGORIES
      ====================================== */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          p-2
          text-gray-300
        "
      >

        <div
          className="
            mb-2
            flex
            items-center
            justify-between
            pl-4
          "
        >

          <span>
            CATEGORIES
          </span>

          <button
            type="button"
            onClick={() => {

              const category =
                prompt(
                  "Enter category name:"
                )

              if (category) {

                alert(
                  `Custom category "${category}" can be added when backend/category management is implemented.`
                )

              }
            }}
            className="
              mr-1
              flex
              h-7
              w-7
              cursor-pointer
              items-center
              justify-center
              rounded-full
              bg-gray-800
              transition
              hover:bg-gradient-to-br
              hover:from-cyan-500
              hover:to-blue-600
            "
          >

            <Plus size={16} />

          </button>

        </div>


        {categories.map(
          (category) => {

            const active =
              selectedCategory ===
              category.name

            return (

              <div
                key={category.name}
                onClick={() => {

                  onCategoryChange(
                    category.name
                  )

                  onClose?.()
                }}
                className={`
                  flex
                  cursor-pointer
                  items-center
                  rounded-2xl
                  p-2.5
                  transition
                  hover:bg-gradient-to-br
                  hover:from-cyan-500
                  hover:to-blue-600

                  ${
                    active
                      ? "bg-gray-700"
                      : ""
                  }
                `}
              >

                <span
                  className={`
                    ml-2
                    h-4
                    w-4
                    shrink-0
                    rounded-full
                    ${category.color}
                  `}
                />

                <div
                  className="
                    flex-1
                    pl-4
                    text-gray-300
                  "
                >
                  {category.name}
                </div>

                <span
                  className="
                    mr-2
                    text-xs
                    text-gray-500
                  "
                >
                  {getCategoryCount(
                    category.name
                  )}
                </span>

              </div>

            )
          }
        )}

      </div>


      {/* ======================================
          DIVIDER
      ====================================== */}

      <div className="mx-2 shrink-0 border-t border-gray-600" />


      {/* ======================================
          FOOTER
      ====================================== */}

      <div
        className="
          mx-4
          flex
          shrink-0
          justify-around
          border-t
          border-gray-700
          pb-4
          pt-4
          text-gray-400
        "
      >

        <button
          type="button"
          className="
            cursor-pointer
            transition
            hover:text-white
          "
        >
          <Settings size={24} />
        </button>

        <button
          type="button"
          className="
            cursor-pointer
            transition
            hover:text-white
          "
        >
          <CircleHelp size={24} />
        </button>

        <button
          type="button"
          onClick={() => {

            if (
              window.confirm(
                "Do you want to clear all tasks?"
              )
            ) {

              localStorage.removeItem(
                "taskify-tasks"
              )

              window.location.reload()
            }

          }}
          className="
            cursor-pointer
            transition
            hover:text-white
          "
        >
          <LogOut size={24} />
        </button>

      </div>

    </div>
  )
}

export default LeftBar