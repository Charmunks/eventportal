<script>
    let { data } = $props();
</script>

<div class="px-4 sm:px-0 mb-6">
    <h1 class="text-2xl font-semibold text-gray-900">Analytics</h1>
</div>

<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
    <!-- Event Analytics -->
    <div class="space-y-6">
        <h2 class="text-lg font-medium text-gray-900">Most Completed Events</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul role="list" class="divide-y divide-gray-200">
                {#if data.eventStats.length === 0}
                    <li class="px-4 py-4 sm:px-6 text-sm text-gray-500">No events completed yet.</li>
                {:else}
                    {#each data.eventStats as event}
                        <li class="px-4 py-4 sm:px-6">
                            <div class="flex items-center justify-between">
                                <div class="flex flex-col">
                                    <p class="text-sm font-medium text-indigo-600 truncate">{event.title}</p>
                                    <p class="text-xs text-gray-500">{event.category}</p>
                                </div>
                                <div class="ml-2 flex-shrink-0 flex">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {event.count} completions
                                    </span>
                                </div>
                            </div>
                        </li>
                    {/each}
                {/if}
            </ul>
        </div>
    </div>

    <!-- Ship Analytics -->
    <div class="space-y-6">
        <h2 class="text-lg font-medium text-gray-900">Ship Analytics</h2>
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 gap-4">
            <div class="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                <dt class="text-sm font-medium text-gray-500 truncate">Total Ships</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">{data.shipStats.totalShips}</dd>
            </div>
            <div class="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
                <dt class="text-sm font-medium text-gray-500 truncate">Avg Ships / Club</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">{data.shipStats.avgShipsPerClub}</dd>
            </div>
        </div>

        <!-- Top Projects -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Top Projects</h3>
            </div>
            <ul role="list" class="divide-y divide-gray-200">
                {#each data.shipStats.topShips as ship}
                    <li class="px-4 py-4 sm:px-6 flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-900">{ship.name}</span>
                        <span class="text-sm text-gray-500">{ship.count} ships</span>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<!-- Recent Ships List -->
<div class="mt-8">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Ships (Sample)</h2>
    <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {#if data.shipStats.sampleShips.length === 0}
                                <tr>
                                    <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No ships found.</td>
                                </tr>
                            {:else}
                                {#each data.shipStats.sampleShips as ship}
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ship.name}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ship.memberName || 'Unknown'}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <a href="/admin/clubs/{ship.clubId}/users" class="text-indigo-600 hover:underline">{ship.clubName}</a>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                            {#if ship.codeUrl}
                                                <a href={ship.codeUrl} target="_blank" rel="noopener noreferrer" class="hover:underline">View Code</a>
                                            {:else}
                                                <span class="text-gray-400">No link</span>
                                            {/if}
                                        </td>
                                    </tr>
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
