/* ============================================
   CivicPulse — Seed Data
   Realistic demo reports for presentation.
   All clearly marked with isDemo: true.
   ============================================ */

const SeedData = (() => {
    'use strict';

    function getDemoReports() {
        const now = new Date();
        const daysAgo = (d) => {
            const date = new Date(now);
            date.setDate(date.getDate() - d);
            date.setHours(Math.floor(Math.random() * 12) + 6, Math.floor(Math.random() * 60));
            return date.toISOString();
        };

        return [
            {
                id: 'CP-1001',
                title: 'Large pothole near main crossing',
                category: 'pothole',
                location: 'Sector 62',
                description: 'A large pothole has formed near the main crossing of Sector 62, causing significant difficulty for vehicles and pedestrians. Several two-wheelers have already skidded here during rain. The pothole is approximately 2 feet wide and growing.',
                severity: 'high',
                status: 'Verified',
                createdAt: daysAgo(14),
                updatedAt: daysAgo(10),
                reportedBy: 'demo_user_1',
                confirmations: 23,
                confirmedBy: Array.from({length: 23}, (_, i) => `demo_confirmer_${i}`),
                verified: true,
                verifiedAt: daysAgo(12),
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(14), by: 'demo_user_1' },
                    { status: 'Verified', timestamp: daysAgo(12), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1002',
                title: 'Overflowing garbage bins at market area',
                category: 'garbage',
                location: 'Sector 22',
                description: 'Multiple garbage bins near the Sector 22 market have been overflowing for the past three days. Waste is scattered on the road and the stench is making it difficult for shopkeepers and visitors. Stray animals are spreading the garbage further.',
                severity: 'high',
                status: 'In Progress',
                createdAt: daysAgo(8),
                updatedAt: daysAgo(3),
                reportedBy: 'demo_user_2',
                confirmations: 31,
                confirmedBy: Array.from({length: 31}, (_, i) => `demo_confirmer_g${i}`),
                verified: true,
                verifiedAt: daysAgo(6),
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(8), by: 'demo_user_2' },
                    { status: 'Verified', timestamp: daysAgo(6), by: 'admin' },
                    { status: 'In Progress', timestamp: daysAgo(3), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1003',
                title: 'Streetlight not working on Ring Road stretch',
                category: 'streetlight',
                location: 'Sector 44',
                description: 'A stretch of approximately 200 meters on Ring Road near Sector 44 has been completely dark for two weeks. The streetlights are not functioning, creating a safety hazard for commuters especially at night.',
                severity: 'critical',
                status: 'Verified',
                createdAt: daysAgo(18),
                updatedAt: daysAgo(15),
                reportedBy: 'demo_user_3',
                confirmations: 42,
                confirmedBy: Array.from({length: 42}, (_, i) => `demo_confirmer_s${i}`),
                verified: true,
                verifiedAt: daysAgo(15),
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(18), by: 'demo_user_3' },
                    { status: 'Verified', timestamp: daysAgo(15), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1004',
                title: 'Water pipeline leaking continuously',
                category: 'water',
                location: 'Civil Lines',
                description: 'A water pipeline near the Civil Lines junction has been leaking continuously for over a week. Significant water is being wasted and the road surface has become slippery. The leakage appears to be from a joint in the main supply line.',
                severity: 'high',
                status: 'In Progress',
                createdAt: daysAgo(10),
                updatedAt: daysAgo(4),
                reportedBy: 'demo_user_4',
                confirmations: 15,
                confirmedBy: Array.from({length: 15}, (_, i) => `demo_confirmer_w${i}`),
                verified: true,
                verifiedAt: daysAgo(8),
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(10), by: 'demo_user_4' },
                    { status: 'Verified', timestamp: daysAgo(8), by: 'admin' },
                    { status: 'In Progress', timestamp: daysAgo(4), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1005',
                title: 'Traffic signal malfunctioning at busy intersection',
                category: 'traffic',
                location: 'Sector 35',
                description: 'The traffic signal at the Sector 35 main intersection has been showing only blinking yellow for three days. This has led to multiple near-miss incidents and significant traffic jams during peak hours.',
                severity: 'critical',
                status: 'Resolved',
                createdAt: daysAgo(21),
                updatedAt: daysAgo(7),
                reportedBy: 'demo_user_5',
                confirmations: 56,
                confirmedBy: Array.from({length: 56}, (_, i) => `demo_confirmer_t${i}`),
                verified: true,
                verifiedAt: daysAgo(19),
                resolvedAt: daysAgo(7),
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(21), by: 'demo_user_5' },
                    { status: 'Verified', timestamp: daysAgo(19), by: 'admin' },
                    { status: 'In Progress', timestamp: daysAgo(14), by: 'admin' },
                    { status: 'Resolved', timestamp: daysAgo(7), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1006',
                title: 'Construction debris blocking pedestrian path',
                category: 'obstruction',
                location: 'Sector 18',
                description: 'Construction debris from a nearby building site has been dumped on the pedestrian walkway near Sector 18 park. Pedestrians are forced to walk on the main road, which is dangerous.',
                severity: 'medium',
                status: 'Pending',
                createdAt: daysAgo(3),
                updatedAt: daysAgo(3),
                reportedBy: 'demo_user_6',
                confirmations: 8,
                confirmedBy: Array.from({length: 8}, (_, i) => `demo_confirmer_o${i}`),
                verified: false,
                verifiedAt: null,
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(3), by: 'demo_user_6' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1007',
                title: 'Severe waterlogging after light rainfall',
                category: 'waterlogging',
                location: 'Sector 52',
                description: 'Even light rainfall causes severe waterlogging in the Sector 52 market area. The drains appear to be completely clogged. Last week, water levels rose to nearly one foot within an hour of rainfall, damaging shops.',
                severity: 'high',
                status: 'Verified',
                createdAt: daysAgo(12),
                updatedAt: daysAgo(9),
                reportedBy: 'demo_user_7',
                confirmations: 28,
                confirmedBy: Array.from({length: 28}, (_, i) => `demo_confirmer_wl${i}`),
                verified: true,
                verifiedAt: daysAgo(9),
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(12), by: 'demo_user_7' },
                    { status: 'Verified', timestamp: daysAgo(9), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1008',
                title: 'Public park benches and playground equipment damaged',
                category: 'park',
                location: 'Sector 21',
                description: 'Several benches in the Sector 21 Central Park are broken and the children\'s playground swings are in unsafe condition. One swing set has a broken chain and rusty joints. Multiple families have complained.',
                severity: 'medium',
                status: 'Resolved',
                createdAt: daysAgo(30),
                updatedAt: daysAgo(8),
                reportedBy: 'demo_user_8',
                confirmations: 19,
                confirmedBy: Array.from({length: 19}, (_, i) => `demo_confirmer_p${i}`),
                verified: true,
                verifiedAt: daysAgo(27),
                resolvedAt: daysAgo(8),
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(30), by: 'demo_user_8' },
                    { status: 'Verified', timestamp: daysAgo(27), by: 'admin' },
                    { status: 'In Progress', timestamp: daysAgo(18), by: 'admin' },
                    { status: 'Resolved', timestamp: daysAgo(8), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1009',
                title: 'Open drainage cover near school entrance',
                category: 'drainage',
                location: 'Sector 15',
                description: 'A drainage cover near the entrance of the government school in Sector 15 has been missing for several days. Children and pedestrians are at risk of falling in. The opening is approximately 2 feet across.',
                severity: 'critical',
                status: 'In Progress',
                createdAt: daysAgo(5),
                updatedAt: daysAgo(2),
                reportedBy: 'demo_user_9',
                confirmations: 35,
                confirmedBy: Array.from({length: 35}, (_, i) => `demo_confirmer_d${i}`),
                verified: true,
                verifiedAt: daysAgo(4),
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(5), by: 'demo_user_9' },
                    { status: 'Verified', timestamp: daysAgo(4), by: 'admin' },
                    { status: 'In Progress', timestamp: daysAgo(2), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1010',
                title: 'Loud construction noise during late night hours',
                category: 'noise',
                location: 'Sector 72',
                description: 'A construction site in Sector 72 has been operating heavy machinery well past midnight for the last two weeks. Residents in nearby buildings are unable to sleep. This violates noise pollution regulations.',
                severity: 'medium',
                status: 'Verified',
                createdAt: daysAgo(6),
                updatedAt: daysAgo(4),
                reportedBy: 'demo_user_10',
                confirmations: 22,
                confirmedBy: Array.from({length: 22}, (_, i) => `demo_confirmer_n${i}`),
                verified: true,
                verifiedAt: daysAgo(4),
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(6), by: 'demo_user_10' },
                    { status: 'Verified', timestamp: daysAgo(4), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1011',
                title: 'Exposed electrical wires near bus stand',
                category: 'electrical',
                location: 'Sector 45',
                description: 'Exposed high-voltage electrical wires are hanging low near the Sector 45 bus stand. Rain water has been dripping over them. This is an immediate safety hazard for the hundreds of commuters who use this bus stand daily.',
                severity: 'critical',
                status: 'Pending',
                createdAt: daysAgo(1),
                updatedAt: daysAgo(1),
                reportedBy: 'demo_user_11',
                confirmations: 11,
                confirmedBy: Array.from({length: 11}, (_, i) => `demo_confirmer_e${i}`),
                verified: false,
                verifiedAt: null,
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(1), by: 'demo_user_11' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1012',
                title: 'Multiple potholes on internal colony road',
                category: 'pothole',
                location: 'Model Town',
                description: 'The internal road connecting Model Town blocks A and B has developed multiple potholes after recent heavy rains. Vehicles are swerving to avoid them, creating a dangerous situation for cyclists and pedestrians.',
                severity: 'medium',
                status: 'Pending',
                createdAt: daysAgo(2),
                updatedAt: daysAgo(2),
                reportedBy: 'demo_user_12',
                confirmations: 14,
                confirmedBy: Array.from({length: 14}, (_, i) => `demo_confirmer_p2_${i}`),
                verified: false,
                verifiedAt: null,
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(2), by: 'demo_user_12' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1013',
                title: 'Garbage not collected for 5 days in residential area',
                category: 'garbage',
                location: 'Sector 63',
                description: 'Municipal garbage collection has not taken place in Sector 63, Block C for the past five days. Waste is piling up at the collection points and the smell is unbearable for nearby residents.',
                severity: 'high',
                status: 'Resolved',
                createdAt: daysAgo(15),
                updatedAt: daysAgo(9),
                reportedBy: 'demo_user_13',
                confirmations: 26,
                confirmedBy: Array.from({length: 26}, (_, i) => `demo_confirmer_g2_${i}`),
                verified: true,
                verifiedAt: daysAgo(13),
                resolvedAt: daysAgo(9),
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(15), by: 'demo_user_13' },
                    { status: 'Verified', timestamp: daysAgo(13), by: 'admin' },
                    { status: 'In Progress', timestamp: daysAgo(11), by: 'admin' },
                    { status: 'Resolved', timestamp: daysAgo(9), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1014',
                title: 'Broken footpath tiles creating tripping hazard',
                category: 'obstruction',
                location: 'Rajpur Road',
                description: 'Several tiles on the footpath along Rajpur Road have been broken and uplifted, creating a tripping hazard for pedestrians. An elderly person reportedly tripped and was injured last week.',
                severity: 'medium',
                status: 'Pending',
                createdAt: daysAgo(4),
                updatedAt: daysAgo(4),
                reportedBy: 'demo_user_14',
                confirmations: 9,
                confirmedBy: Array.from({length: 9}, (_, i) => `demo_confirmer_fp_${i}`),
                verified: false,
                verifiedAt: null,
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(4), by: 'demo_user_14' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1015',
                title: 'Water supply disrupted for two days',
                category: 'water',
                location: 'Sector 56',
                description: 'Residential areas in Sector 56 have been experiencing intermittent water supply for the past two days. Tanker services have not been arranged as an alternative. Hundreds of families are affected.',
                severity: 'high',
                status: 'Resolved',
                createdAt: daysAgo(20),
                updatedAt: daysAgo(14),
                reportedBy: 'demo_user_15',
                confirmations: 45,
                confirmedBy: Array.from({length: 45}, (_, i) => `demo_confirmer_ws_${i}`),
                verified: true,
                verifiedAt: daysAgo(19),
                resolvedAt: daysAgo(14),
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(20), by: 'demo_user_15' },
                    { status: 'Verified', timestamp: daysAgo(19), by: 'admin' },
                    { status: 'In Progress', timestamp: daysAgo(17), by: 'admin' },
                    { status: 'Resolved', timestamp: daysAgo(14), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1016',
                title: 'Fallen tree blocking half the road',
                category: 'obstruction',
                location: 'Sector 78',
                description: 'A large tree has fallen and is blocking approximately half the carriageway on the main road near Sector 78 entrance. Traffic is being diverted to the wrong side, causing congestion and risk of head-on collisions.',
                severity: 'critical',
                status: 'Resolved',
                createdAt: daysAgo(9),
                updatedAt: daysAgo(7),
                reportedBy: 'demo_user_16',
                confirmations: 33,
                confirmedBy: Array.from({length: 33}, (_, i) => `demo_confirmer_ft_${i}`),
                verified: true,
                verifiedAt: daysAgo(9),
                resolvedAt: daysAgo(7),
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(9), by: 'demo_user_16' },
                    { status: 'Verified', timestamp: daysAgo(9), by: 'admin' },
                    { status: 'In Progress', timestamp: daysAgo(8), by: 'admin' },
                    { status: 'Resolved', timestamp: daysAgo(7), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1017',
                title: 'Stagnant water breeding mosquitoes in park pond',
                category: 'waterlogging',
                location: 'Sector 21',
                description: 'The decorative pond in Sector 21 park has become stagnant and is breeding mosquitoes. Several dengue cases have been reported from surrounding areas. The water has turned green and foul-smelling.',
                severity: 'high',
                status: 'Verified',
                createdAt: daysAgo(7),
                updatedAt: daysAgo(5),
                reportedBy: 'demo_user_17',
                confirmations: 18,
                confirmedBy: Array.from({length: 18}, (_, i) => `demo_confirmer_sw_${i}`),
                verified: true,
                verifiedAt: daysAgo(5),
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(7), by: 'demo_user_17' },
                    { status: 'Verified', timestamp: daysAgo(5), by: 'admin' }
                ],
                isDemo: true
            },
            {
                id: 'CP-1018',
                title: 'Street vendor encroachment blocking traffic',
                category: 'obstruction',
                location: 'Clock Tower Area',
                description: 'Street vendors have encroached onto the main road near Clock Tower, reducing the carriageway to a single lane. This is causing severe traffic jams during morning and evening hours.',
                severity: 'low',
                status: 'Rejected',
                createdAt: daysAgo(25),
                updatedAt: daysAgo(22),
                reportedBy: 'demo_user_18',
                confirmations: 5,
                confirmedBy: Array.from({length: 5}, (_, i) => `demo_confirmer_sv_${i}`),
                verified: false,
                verifiedAt: null,
                resolvedAt: null,
                image: null,
                statusHistory: [
                    { status: 'Pending', timestamp: daysAgo(25), by: 'demo_user_18' },
                    { status: 'Rejected', timestamp: daysAgo(22), by: 'admin' }
                ],
                isDemo: true
            }
        ];
    }

    function loadIfNeeded() {
        if (!DataService.isSeedDataLoaded()) {
            DataService.loadSeedData(getDemoReports());
        }
    }

    return { getDemoReports, loadIfNeeded };
})();
