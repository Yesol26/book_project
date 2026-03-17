import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, ExternalLink, Clock, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClubCalendarProps {
    myGroups: any[];
}

export default function ClubCalendar({ myGroups }: ClubCalendarProps) {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Calculate schedules mapping day of month (1~31) to an array of clubs
    const schedulesByDay = useMemo(() => {
        const schedules: Record<number, any[]> = {};
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            const dayClubs = myGroups.filter(club => {
                if (!club.meetingDayOfWeek) return false;
                const days = club.meetingDayOfWeek.split(',').map(Number);
                return days.includes(dayOfWeek);
            });
            if (dayClubs.length > 0) {
                schedules[day] = dayClubs;
            }
        }
        return schedules;
    }, [year, month, daysInMonth, myGroups]);

    // Handle clicking a day
    const handleDayClick = (day: number) => {
        if (schedulesByDay[day]) {
            setSelectedDate(day);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-sm">내 모임 일정</h3>
                <div className="flex items-center gap-2">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-sm font-bold text-gray-700">{year}년 {month + 1}월</span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-2 font-medium text-gray-400">
                {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-1" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const clubs = schedulesByDay[day] || [];
                    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                    return (
                        <div
                            key={day}
                            onClick={() => handleDayClick(day)}
                            className={`min-h-[40px] p-1 rounded-lg border border-transparent flex flex-col items-center justify-start relative transition-colors ${clubs.length > 0 ? 'cursor-pointer hover:bg-indigo-50 border-gray-100' : ''
                                } ${isToday ? 'bg-indigo-50' : ''}`}
                        >
                            <span className={`text-[11px] font-bold ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
                                {day}
                            </span>

                            {clubs.length > 0 && (
                                <div className="flex flex-wrap gap-1 w-full mt-1 justify-center px-1">
                                    {clubs.slice(0, 3).map((club) => (
                                        <div
                                            key={club.id}
                                            title={club.name}
                                            className="w-2 h-2 rounded-full shrink-0"
                                            style={{ backgroundColor: club.color || '#6366f1' }}
                                        />
                                    ))}
                                    {clubs.length > 3 && <div className="text-[9px] text-gray-400 font-medium">+{clubs.length - 3}</div>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Popup Modal for Day Details */}
            {selectedDate && (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl" onClick={() => setSelectedDate(null)} />

                    {/* Content */}
                    <div className="relative bg-white border border-gray-200 shadow-xl rounded-xl w-full max-w-[280px] p-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <h4 className="font-bold text-gray-900 text-sm">{month + 1}월 {selectedDate}일 일정</h4>
                            <button onClick={() => setSelectedDate(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {schedulesByDay[selectedDate]?.map(club => {
                                const currentBooks = club.books?.filter((b: any) => b.status === 'READING') || [];
                                const titles = currentBooks.map((cb: any) => cb.book.title).join(', ');

                                return (
                                    <div key={club.id} className="text-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: club.color || '#6366f1' }} />
                                            <span className="font-bold text-gray-800 line-clamp-1">{club.name}</span>
                                        </div>

                                        <div className="pl-4 space-y-1 text-xs text-gray-600">
                                            {club.meetingTime && (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    <span>{club.meetingTime}</span>
                                                </div>
                                            )}
                                            {titles && (
                                                <div className="flex items-start gap-1.5">
                                                    <BookOpen className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                                                    <span className="line-clamp-2">{titles}</span>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => router.push(`/groups/${club.id}`)}
                                            className="mt-2 w-full py-1.5 bg-gray-50 hover:bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-1"
                                        >
                                            상세 보기 <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
