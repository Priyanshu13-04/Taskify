import React, {
    useMemo,
    useRef,
    useState,
} from "react"

import {
    CircleCheck,
    Inbox,
    Plus,
    Flag,
    Calendar,
    Timer,
    Star,
    Sun,
    CheckCircle,
    Search,
    Bell,
    CircleUserRound,
    Trash2,
    ChevronDown,
    ClipboardList,
    Sparkles,
    Menu,
} from "lucide-react"


const RightHalf = ({
    tasks,
    activeFilter,
    selectedCategory,
    searchText,
    setSearchText,
    onAddTask,
    onToggleTask,
    onDeleteTask,
    onTogglePriority,
    onFilterChange,
    onOpenSidebar,
}) => {

    const [taskTitle, setTaskTitle] =
        useState("")

    const [dueDate, setDueDate] =
        useState("")

    const [priority, setPriority] =
        useState(false)

    const [showSearch, setShowSearch] =
        useState(false)

    const [showNotifications, setShowNotifications] =
        useState(false)

    const [showProfile, setShowProfile] =
        useState(false)

    const [sortOption, setSortOption] =
        useState("Priority")

    const [showSortMenu, setShowSortMenu] =
        useState(false)

    const dateInputRef =
        useRef(null)

    const taskInputRef =
        useRef(null)


    // ==========================================
    // GREETING
    // ==========================================

    const getGreeting = () => {

        const hour =
            new Date().getHours()

        if (
            hour >= 5 &&
            hour < 12
        ) {
            return "Good morning"
        }

        if (
            hour >= 12 &&
            hour < 17
        ) {
            return "Good afternoon"
        }

        if (
            hour >= 17 &&
            hour < 21
        ) {
            return "Good evening"
        }

        return "Good night"
    }


    // ==========================================
    // LOCAL DATE
    // ==========================================

    const getLocalDate = () => {

        const today =
            new Date()

        const year =
            today.getFullYear()

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0")

        const day =
            String(
                today.getDate()
            ).padStart(2, "0")

        return `${year}-${month}-${day}`
    }


    // ==========================================
    // CALENDAR
    // ==========================================

    const openCalendar = () => {

        if (!dateInputRef.current) {
            return
        }

        if (
            typeof dateInputRef.current.showPicker ===
            "function"
        ) {

            try {

                dateInputRef.current.showPicker()

            } catch {

                dateInputRef.current.focus()
            }

        } else {

            dateInputRef.current.focus()
        }
    }


    // ==========================================
    // FOCUS INPUT
    // ==========================================

    const focusTaskInput = () => {

        taskInputRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        })

        setTimeout(() => {

            taskInputRef.current?.focus()

        }, 300)
    }


    // ==========================================
    // ADD TASK
    // ==========================================

    const handleAddTask = () => {

        const title =
            taskTitle.trim()

        if (!title) {

            taskInputRef.current?.focus()

            return
        }

        onAddTask({
            title,
            dueDate,
            priority,
            category:
                selectedCategory,
        })

        setTaskTitle("")
        setDueDate("")
        setPriority(false)

        setTimeout(() => {

            taskInputRef.current?.focus()

        }, 100)
    }


    // ==========================================
    // DATE CHECK
    // ==========================================

    const isToday = (date) => {

        if (!date) {
            return false
        }

        return (
            date === getLocalDate()
        )
    }


    const isUpcoming = (date) => {

        if (!date) {
            return false
        }

        return (
            date > getLocalDate()
        )
    }


    // ==========================================
    // FILTER + SORT
    // ==========================================

    const filteredTasks =
        useMemo(() => {

            let result =
                [...tasks]


            // TODAY

            if (
                activeFilter ===
                "Today"
            ) {

                result =
                    result.filter(
                        (task) =>
                            !task.completed &&
                            isToday(
                                task.dueDate
                            )
                    )

            }


            // UPCOMING

            else if (
                activeFilter ===
                "Upcoming"
            ) {

                result =
                    result.filter(
                        (task) =>
                            !task.completed &&
                            isUpcoming(
                                task.dueDate
                            )
                    )

            }


            // COMPLETED

            else if (
                activeFilter ===
                "Completed"
            ) {

                result =
                    result.filter(
                        (task) =>
                            task.completed
                    )
            }


            // CATEGORY

            if (
                selectedCategory &&
                selectedCategory !==
                "All"
            ) {

                result =
                    result.filter(
                        (task) =>
                            task.category ===
                            selectedCategory
                    )
            }


            // SEARCH

            if (
                searchText.trim()
            ) {

                const search =
                    searchText
                        .toLowerCase()
                        .trim()

                result =
                    result.filter(
                        (task) => {

                            const title =
                                task.title
                                    ?.toLowerCase() ||
                                ""

                            const category =
                                task.category
                                    ?.toLowerCase() ||
                                ""

                            return (
                                title.includes(
                                    search
                                ) ||
                                category.includes(
                                    search
                                )
                            )
                        }
                    )
            }


            // SORT

            if (
                sortOption ===
                "Priority"
            ) {

                result.sort(
                    (a, b) =>
                        Number(b.priority) -
                        Number(a.priority)
                )

            }

            else if (
                sortOption ===
                "Due Date"
            ) {

                result.sort(
                    (a, b) => {

                        if (
                            !a.dueDate &&
                            !b.dueDate
                        ) {
                            return 0
                        }

                        if (!a.dueDate) {
                            return 1
                        }

                        if (!b.dueDate) {
                            return -1
                        }

                        return a.dueDate.localeCompare(
                            b.dueDate
                        )
                    }
                )

            }

            else if (
                sortOption ===
                "Alphabetical"
            ) {

                result.sort(
                    (a, b) =>
                        (
                            a.title || ""
                        ).localeCompare(
                            b.title || ""
                        )
                )

            }

            else if (
                sortOption ===
                "Newest"
            ) {

                result.reverse()
            }


            return result

        }, [
            tasks,
            activeFilter,
            selectedCategory,
            searchText,
            sortOption,
        ])


    // ==========================================
    // STATISTICS
    // ==========================================

    const totalTasks =
        tasks.length

    const completedTasks =
        tasks.filter(
            (task) =>
                task.completed
        ).length

    const inProgress =
        tasks.filter(
            (task) =>
                !task.completed
        ).length

    const highPriority =
        tasks.filter(
            (task) =>
                task.priority &&
                !task.completed
        ).length


    return (

        <div className="min-w-0 text-white">

            {/* ======================================
          HEADER
      ====================================== */}

            <div
                className="
          flex
          w-full
          items-start
          justify-between
          gap-3
          p-4
          sm:p-6
        "
            >

                {/* LEFT */}

                <div
                    className="
            flex
            min-w-0
            items-start
            gap-3
            lg:pl-7
          "
                >

                    {/* MOBILE MENU */}

                    <button
                        type="button"
                        onClick={onOpenSidebar}
                        className="
              mt-1
              flex
              h-10
              w-10
              shrink-0
              cursor-pointer
              items-center
              justify-center
              rounded-xl
              bg-gray-800
              text-gray-300
              transition
              hover:bg-gray-700
              hover:text-white
              lg:hidden
            "
                    >
                        <Menu size={21} />
                    </button>


                    <div className="min-w-0">

                        <div
                            className="
                truncate
                text-xl
                font-medium
                sm:text-2xl
                lg:text-3xl
              "
                        >
                            {getGreeting()},
                            {" "}
                            Priyanshu! 👋
                        </div>

                        <div
                            className="
                mt-1
                text-sm
                text-gray-400
                sm:mt-2
                sm:text-lg
              "
                        >
                            Let's make today
                            productive.
                        </div>

                    </div>

                </div>


                {/* RIGHT */}

                <div
                    className="
            relative
            flex
            shrink-0
            items-center
            gap-4
            pt-2
            sm:gap-7
            sm:pt-4
            sm:pr-4
            lg:gap-10
            lg:pr-6
          "
                >

                    {/* SEARCH */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowSearch(
                                !showSearch
                            )
                        }
                        className="
              cursor-pointer
              transition
              hover:text-cyan-400
            "
                    >
                        <Search size={24} />
                    </button>


                    {/* NOTIFICATION */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowNotifications(
                                !showNotifications
                            )
                        }
                        className="
              relative
              cursor-pointer
              transition
              hover:text-cyan-400
            "
                    >

                        <Bell size={24} />

                        {tasks.length > 0 && (

                            <span
                                className="
                  absolute
                  -right-2
                  -top-2
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  text-[10px]
                "
                            >
                                {tasks.length}
                            </span>

                        )}

                    </button>


                    {/* PROFILE */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowProfile(
                                !showProfile
                            )
                        }
                        className="
              cursor-pointer
              transition
              hover:text-cyan-400
            "
                    >
                        <CircleUserRound
                            size={24}
                        />
                    </button>


                    {/* SEARCH POPUP */}

                    {showSearch && (

                        <div
                            className="
                absolute
                right-0
                top-14
                z-50
                rounded-xl
                border
                border-gray-600
                bg-gray-800
                p-3
                shadow-xl
              "
                        >

                            <input
                                autoFocus
                                value={searchText}
                                onChange={(e) =>
                                    setSearchText(
                                        e.target.value
                                    )
                                }
                                placeholder="Search tasks..."
                                className="
                  w-[min(220px,calc(100vw-32px))]
                  rounded-lg
                  border
                  border-gray-600
                  bg-gray-900
                  px-3
                  py-2
                  text-white
                  outline-none
                "
                            />

                        </div>

                    )}


                    {/* NOTIFICATION POPUP */}

                    {showNotifications && (

                        <div
                            className="
                absolute
                right-0
                top-14
                z-50
                w-[250px]
                max-w-[calc(100vw-24px)]
                rounded-xl
                border
                border-gray-600
                bg-gray-800
                p-4
                shadow-xl
              "
                        >

                            <div className="mb-3 font-medium">
                                Notifications
                            </div>

                            {tasks.length === 0 ? (

                                <p className="text-sm text-gray-400">
                                    No tasks yet.
                                </p>

                            ) : (

                                <p className="text-sm text-gray-400">
                                    You have{" "}
                                    {tasks.length} task
                                    {tasks.length > 1
                                        ? "s"
                                        : ""}.
                                </p>

                            )}

                        </div>

                    )}


                    {/* PROFILE POPUP */}

                    {showProfile && (

                        <div
                            className="
                absolute
                right-0
                top-14
                z-50
                w-[180px]
                max-w-[calc(100vw-24px)]
                rounded-xl
                border
                border-gray-600
                bg-gray-800
                p-3
                shadow-xl
              "
                        >

                            <div className="font-medium text-white">
                                Priyanshu
                            </div>

                            <div className="mt-1 text-sm text-gray-400">
                                Taskify User
                            </div>

                        </div>

                    )}

                </div>

            </div>


            {/* ======================================
          ADD TASK
      ====================================== */}

            <div
                className="
          mx-3
          min-h-[75px]
          rounded-2xl
          bg-gradient-to-r
          from-cyan-400
          via-blue-500
          to-cyan-400
          p-[1px]
          sm:mx-5
          md:mx-8
          lg:mx-12
        "
            >

                <div
                    className="
            flex
            min-h-[73px]
            w-full
            flex-col
            justify-between
            gap-3
            rounded-[15px]
            bg-[#111827]
            p-3
            sm:flex-row
            sm:items-center
            sm:p-0
          "
                >

                    {/* INPUT */}

                    <div
                        className="
              flex
              min-w-0
              flex-1
              items-center
              gap-3
              sm:ml-6
              sm:gap-4
            "
                    >

                        <button
                            type="button"
                            onClick={
                                handleAddTask
                            }
                            className="
                flex
                h-8
                w-8
                shrink-0
                cursor-pointer
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-cyan-400
                to-blue-600
                transition
                hover:scale-105
              "
                        >

                            <Plus
                                size={18}
                                className="text-white"
                            />

                        </button>


                        <input
                            ref={taskInputRef}
                            value={taskTitle}
                            onChange={(e) =>
                                setTaskTitle(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {

                                if (
                                    e.key === "Enter"
                                ) {
                                    handleAddTask()
                                }

                            }}
                            placeholder="What do you want to do?"
                            className="
                min-w-0
                flex-1
                bg-transparent
                text-[15px]
                text-white
                outline-none
                placeholder:text-gray-400
                sm:text-[17px]
              "
                        />

                    </div>


                    {/* OPTIONS */}

                    <div
                        className="
              flex
              w-full
              items-center
              justify-end
              gap-4
              sm:w-auto
              sm:gap-8
              sm:mr-6
            "
                    >

                        {/* CATEGORY */}

                        <span
                            className="
                max-w-[80px]
                truncate
                text-sm
                text-gray-400
                sm:max-w-none
              "
                        >
                            {selectedCategory ||
                                "All"}
                        </span>


                        {/* CALENDAR */}

                        <button
                            type="button"
                            onClick={
                                openCalendar
                            }
                            className={
                                dueDate
                                    ? "cursor-pointer text-cyan-400"
                                    : "cursor-pointer text-white"
                            }
                        >
                            <Calendar size={20} />
                        </button>


                        <input
                            ref={dateInputRef}
                            type="date"
                            value={dueDate}
                            onChange={(e) =>
                                setDueDate(
                                    e.target.value
                                )
                            }
                            className="hidden"
                        />


                        {/* PRIORITY */}

                        <button
                            type="button"
                            onClick={() =>
                                setPriority(
                                    !priority
                                )
                            }
                            className={
                                priority
                                    ? "cursor-pointer text-red-400"
                                    : "cursor-pointer text-white"
                            }
                        >
                            <Flag size={20} />
                        </button>


                        {/* ADD */}

                        <button
                            type="button"
                            onClick={
                                handleAddTask
                            }
                            className="
                cursor-pointer
                whitespace-nowrap
                rounded-xl
                bg-gradient-to-br
                from-cyan-400
                to-blue-600
                px-5
                py-2.5
                text-sm
                text-white
                transition
                hover:from-cyan-300
                hover:to-blue-500
                sm:px-8
                sm:py-3
              "
                        >
                            Add Task
                        </button>

                    </div>

                </div>

            </div>


            {/* ======================================
          STATISTICS
      ====================================== */}

            <div
                className="
          grid
          grid-cols-2
          gap-3
          px-3
          pt-6
          sm:gap-4
          sm:px-5
          md:px-8
          lg:grid-cols-4
          lg:px-12
          lg:pt-8
          xl:gap-6
        "
            >

                {/* TOTAL */}

                <div
                    className="
            relative
            flex
            h-[98px]
            w-full
            items-center
            gap-3
            overflow-hidden
            rounded-xl
            border
            border-purple-500/40
            bg-gradient-to-br
            from-[#151b2b]
            to-[#24152f]
            pl-3
            sm:gap-4
            sm:pl-5
          "
                >

                    <Calendar
                        size={30}
                        strokeWidth={2}
                        color="#c000ff"
                        className="shrink-0 sm:h-9 sm:w-9"
                    />

                    <div>

                        <div className="text-[19px] font-semibold leading-none">
                            {totalTasks}
                        </div>

                        <div className="mt-2 text-[11px] text-gray-300">
                            Total Tasks
                        </div>

                    </div>

                    <svg
                        className="
              absolute
              bottom-0
              left-0
              h-[25px]
              w-full
            "
                        viewBox="0 0 200 30"
                        preserveAspectRatio="none"
                    >

                        <path
                            d="M0 20 C20 10, 35 28, 55 20 S90 10, 110 20 S145 28, 165 20 S185 10, 200 20"
                            fill="none"
                            stroke="#c000ff"
                            strokeWidth="1"
                            opacity="0.7"
                        />

                    </svg>

                </div>


                {/* COMPLETED */}

                <div
                    className="
            relative
            flex
            h-[98px]
            w-full
            items-center
            gap-3
            overflow-hidden
            rounded-xl
            border
            border-sky-500/40
            bg-gradient-to-br
            from-[#151d2b]
            to-[#102a3d]
            pl-3
            sm:gap-4
            sm:pl-5
          "
                >

                    <CheckCircle
                        size={30}
                        strokeWidth={2}
                        color="#38bdf8"
                        className="shrink-0 sm:h-9 sm:w-9"
                    />

                    <div>

                        <div className="text-[19px] font-semibold leading-none">
                            {completedTasks}
                        </div>

                        <div className="mt-2 text-[11px] text-gray-300">
                            Completed
                        </div>

                    </div>

                    <svg
                        className="
              absolute
              bottom-0
              left-0
              h-[25px]
              w-full
            "
                        viewBox="0 0 200 30"
                        preserveAspectRatio="none"
                    >

                        <path
                            d="M0 20 C20 10, 35 28, 55 20 S90 10, 110 20 S145 28, 165 20 S185 10, 200 20"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="1"
                            opacity="0.7"
                        />

                    </svg>

                </div>


                {/* IN PROGRESS */}

                <div
                    className="
            relative
            flex
            h-[98px]
            w-full
            items-center
            gap-3
            overflow-hidden
            rounded-xl
            border
            border-orange-500/40
            bg-gradient-to-br
            from-[#191d2b]
            to-[#3a1815]
            pl-3
            sm:gap-4
            sm:pl-5
          "
                >

                    <Timer
                        size={30}
                        strokeWidth={2}
                        color="#ff9800"
                        className="shrink-0 sm:h-9 sm:w-9"
                    />

                    <div>

                        <div className="text-[19px] font-semibold leading-none">
                            {inProgress}
                        </div>

                        <div className="mt-2 text-[11px] text-gray-300">
                            In Progress
                        </div>

                    </div>

                    <svg
                        className="
              absolute
              bottom-0
              left-0
              h-[25px]
              w-full
            "
                        viewBox="0 0 200 30"
                        preserveAspectRatio="none"
                    >

                        <path
                            d="M0 20 C20 10, 35 28, 55 20 S90 10, 110 20 S145 28, 165 20 S185 10, 200 20"
                            fill="none"
                            stroke="#ff9800"
                            strokeWidth="1"
                            opacity="0.7"
                        />

                    </svg>

                </div>


                {/* HIGH PRIORITY */}

                <div
                    className="
            relative
            flex
            h-[98px]
            w-full
            items-center
            gap-3
            overflow-hidden
            rounded-xl
            border
            border-green-500/40
            bg-gradient-to-br
            from-[#151d2b]
            to-[#092d25]
            pl-3
            sm:gap-4
            sm:pl-5
          "
                >

                    <Star
                        size={30}
                        strokeWidth={2}
                        color="#00b51a"
                        className="shrink-0 sm:h-9 sm:w-9"
                    />

                    <div>

                        <div className="text-[19px] font-semibold leading-none">
                            {highPriority}
                        </div>

                        <div className="mt-2 text-[11px] text-gray-300">
                            High Priority
                        </div>

                    </div>

                    <svg
                        className="
              absolute
              bottom-0
              left-0
              h-[25px]
              w-full
            "
                        viewBox="0 0 200 30"
                        preserveAspectRatio="none"
                    >

                        <path
                            d="M0 20 C20 10, 35 28, 55 20 S90 10, 110 20 S145 28, 165 20 S185 10, 200 20"
                            fill="none"
                            stroke="#00b51a"
                            strokeWidth="1"
                            opacity="0.7"
                        />

                    </svg>

                </div>

            </div>


            {/* ======================================
          FILTER BAR
      ====================================== */}

            <div
                className="
          mx-3
          mt-6
          min-h-[75px]
          rounded-2xl
          bg-gradient-to-r
          from-cyan-400
          via-blue-500
          to-cyan-400
          p-[1px]
          sm:mx-5
          md:mx-8
          lg:mx-12
          lg:mt-8
        "
            >

                <div
                    className="
            flex
            min-h-[73px]
            w-full
            flex-col
            gap-2
            rounded-[15px]
            bg-gray-800
            p-2
            text-amber-50
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
                >

                    {/* FILTERS */}

                    <div
                        className="
              flex
              w-full
              gap-1
              overflow-x-auto
              p-1
              sm:gap-2
              lg:w-auto
              lg:gap-10
              lg:p-2
            "
                    >

                        {/* ALL */}

                        <div
                            onClick={() =>
                                onFilterChange(
                                    "All"
                                )
                            }
                            className={`
                flex
                h-[50px]
                shrink-0
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                px-4
                transition
                sm:px-6
                lg:px-8

                ${activeFilter ===
                                    "All"
                                    ? "bg-gradient-to-br from-cyan-300 to-blue-600"
                                    : "hover:bg-gray-700"
                                }
              `}
                        >

                            <Inbox size={18} />

                            <span>
                                All
                            </span>

                        </div>


                        {/* TODAY */}

                        <div
                            onClick={() =>
                                onFilterChange(
                                    "Today"
                                )
                            }
                            className={`
                flex
                h-[50px]
                shrink-0
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                px-4
                transition
                sm:px-6
                lg:px-8

                ${activeFilter ===
                                    "Today"
                                    ? "bg-gradient-to-br from-cyan-300 to-blue-600"
                                    : "hover:bg-gray-700"
                                }
              `}
                        >

                            <Sun size={18} />

                            <span>
                                Today
                            </span>

                        </div>


                        {/* UPCOMING */}

                        <div
                            onClick={() =>
                                onFilterChange(
                                    "Upcoming"
                                )
                            }
                            className={`
                flex
                h-[50px]
                shrink-0
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                px-4
                transition
                sm:px-6
                lg:px-8

                ${activeFilter ===
                                    "Upcoming"
                                    ? "bg-gradient-to-br from-cyan-300 to-blue-600"
                                    : "hover:bg-gray-700"
                                }
              `}
                        >

                            <Calendar size={18} />

                            <span>
                                Upcoming
                            </span>

                        </div>


                        {/* COMPLETED */}

                        <div
                            onClick={() =>
                                onFilterChange(
                                    "Completed"
                                )
                            }
                            className={`
                flex
                h-[50px]
                shrink-0
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                px-4
                transition
                sm:px-6
                lg:px-8

                ${activeFilter ===
                                    "Completed"
                                    ? "bg-gradient-to-br from-cyan-300 to-blue-600"
                                    : "hover:bg-gray-700"
                                }
              `}
                        >

                            <CircleCheck size={18} />

                            <span>
                                Completed
                            </span>

                        </div>

                    </div>


                    {/* SORT */}

                    <div
                        className="
              relative
              w-full
              lg:mr-4
              lg:w-auto
            "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setShowSortMenu(
                                    !showSortMenu
                                )
                            }
                            className="
                flex
                h-[46px]
                w-full
                cursor-pointer
                items-center
                justify-between
                gap-3
                rounded-2xl
                border
                border-gray-500
                px-5
                py-2
                transition
                hover:bg-gray-700
                lg:min-w-[190px]
              "
                        >

                            <span>
                                Sort by: {sortOption}
                            </span>

                            <ChevronDown
                                size={17}
                                className={`
                  transition-transform
                  ${showSortMenu
                                        ? "rotate-180"
                                        : ""
                                    }
                `}
                            />

                        </button>


                        {showSortMenu && (

                            <div
                                className="
                  absolute
                  right-0
                  top-12
                  z-50
                  w-full
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-600
                  bg-gray-800
                  shadow-xl
                  lg:w-[190px]
                "
                            >

                                {[
                                    "Priority",
                                    "Due Date",
                                    "Alphabetical",
                                    "Newest",
                                ].map(
                                    (option) => (

                                        <button
                                            type="button"
                                            key={option}
                                            onClick={() => {

                                                setSortOption(
                                                    option
                                                )

                                                setShowSortMenu(
                                                    false
                                                )
                                            }}
                                            className={`
                        w-full
                        cursor-pointer
                        px-4
                        py-3
                        text-left
                        transition

                        ${sortOption ===
                                                    option
                                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                                                    : "text-gray-300 hover:bg-gray-700"
                                                }
                      `}
                                        >
                                            {option}
                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* ======================================
          TASK AREA
      ====================================== */}

            <div
                className="
          mt-5
          w-full
          px-3
          pb-0
          sm:px-5
          md:px-8
          lg:px-12
        "
            >

                {/* ====================================
            NO TASKS
        ==================================== */}

                {tasks.length === 0 ? (

                    <div
                        className="
              flex
              h-[265px]
              w-full
              flex-col
              items-center
              justify-center
              overflow-hidden
              text-center
            "
                    >

                        {/* ICON */}

                        <div
                            className="
                relative
                mb-2
                flex
                h-[120px]
                w-[120px]
                items-center
                justify-center
              "
                        >

                            {/* GLOW */}

                            <div
                                className="
                  absolute
                  inset-5
                  rounded-full
                  bg-cyan-500/10
                  blur-2xl
                "
                            />


                            {/* MAIN CIRCLE */}

                            <div
                                className="
                  relative
                  flex
                  h-[95px]
                  w-[95px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-cyan-500/20
                  bg-gradient-to-br
                  from-gray-800
                  to-gray-900
                  shadow-lg
                  shadow-cyan-500/10
                "
                            >

                                <ClipboardList
                                    size={52}
                                    strokeWidth={1.5}
                                    className="text-cyan-400"
                                />

                            </div>


                            {/* SPARKLES */}

                            <Sparkles
                                size={17}
                                className="
                  absolute
                  right-2
                  top-2
                  text-blue-400
                "
                            />

                            <Sparkles
                                size={12}
                                className="
                  absolute
                  left-2
                  top-7
                  text-cyan-500
                "
                            />

                        </div>


                        <h2
                            className="
                text-xl
                font-semibold
                text-white
              "
                        >
                            No tasks found
                        </h2>


                        <p
                            className="
                mt-2
                text-sm
                text-gray-400
              "
                        >
                            Add a new task to get started
                            and stay productive!
                        </p>


                        <button
                            type="button"
                            onClick={
                                focusTaskInput
                            }
                            className="
                mt-5
                flex
                cursor-pointer
                items-center
                gap-2
                rounded-lg
                bg-gradient-to-r
                from-cyan-400
                to-blue-600
                px-5
                py-2.5
                font-medium
                text-white
                shadow-lg
                shadow-cyan-500/20
                transition-all
                duration-200
                hover:scale-105
                hover:from-cyan-300
                hover:to-blue-500
              "
                        >

                            <Plus size={18} />

                            Add Your First Task

                        </button>

                    </div>

                ) : filteredTasks.length === 0 ? (

                    /* ====================================
                       FILTER EMPTY
                    ==================================== */

                    <div
                        className="
              flex
              h-[250px]
              w-full
              flex-col
              items-center
              justify-center
              overflow-hidden
              text-center
            "
                    >

                        <div
                            className="
                mb-4
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-gray-700
                bg-gray-800
              "
                        >

                            <Inbox
                                size={30}
                                className="text-gray-500"
                            />

                        </div>

                        <div className="text-lg text-gray-300">
                            No tasks found
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Try changing your filter or search.
                        </p>

                    </div>

                ) : (

                    /* ====================================
                       TASK LIST
                    ==================================== */

                    <div className="space-y-3">

                        {filteredTasks.map(
                            (task) => (

                                <div
                                    key={task.id}
                                    className="
                    flex
                    w-full
                    flex-col
                    gap-3
                    rounded-2xl
                    border
                    border-gray-700
                    bg-gray-800
                    p-3
                    transition
                    hover:border-gray-600
                    sm:p-4
                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                                >

                                    {/* TASK INFO */}

                                    <div
                                        className="
                      flex
                      min-w-0
                      items-start
                      gap-3
                      sm:items-center
                      sm:gap-4
                    "
                                    >

                                        {/* COMPLETE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onToggleTask(
                                                    task.id
                                                )
                                            }
                                            className={`
                        mt-0.5
                        flex
                        h-7
                        w-7
                        shrink-0
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-full
                        border
                        transition
                        sm:mt-0

                        ${task.completed
                                                    ? "border-green-500 bg-green-500"
                                                    : "border-gray-500 hover:border-white"
                                                }
                      `}
                                        >

                                            {task.completed && (

                                                <CircleCheck
                                                    size={18}
                                                    className="text-white"
                                                />

                                            )}

                                        </button>


                                        {/* TASK DETAILS */}

                                        <div className="min-w-0">

                                            <div
                                                className={`
                          break-words
                          font-medium
                          text-white

                          ${task.completed
                                                        ? "text-gray-500 line-through"
                                                        : ""
                                                    }
                        `}
                                            >
                                                {task.title}
                                            </div>


                                            <div
                                                className="
                          mt-1
                          flex
                          flex-wrap
                          items-center
                          gap-3
                          text-xs
                          text-gray-400
                        "
                                            >

                                                <span>
                                                    {task.category ||
                                                        "General"}
                                                </span>

                                                {task.dueDate && (

                                                    <span>
                                                        {task.dueDate}
                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    <div
                                        className="
                      flex
                      items-center
                      justify-end
                      gap-5
                      border-t
                      border-gray-700
                      pt-2
                      md:border-0
                      md:pt-0
                    "
                                    >

                                        {/* PRIORITY */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onTogglePriority(
                                                    task.id
                                                )
                                            }
                                            className={`
                        cursor-pointer
                        transition

                        ${task.priority
                                                    ? "text-red-400"
                                                    : "text-gray-500 hover:text-white"
                                                }
                      `}
                                        >

                                            <Flag size={18} />

                                        </button>


                                        {/* DELETE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDeleteTask(
                                                    task.id
                                                )
                                            }
                                            className="
                        cursor-pointer
                        text-gray-500
                        transition
                        hover:text-red-400
                      "
                                        >

                                            <Trash2 size={18} />

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    )
}


export default RightHalf