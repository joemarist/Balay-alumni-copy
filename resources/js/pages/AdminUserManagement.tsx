import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { users } from '@/routes';


type UserRole = 'Customer' | 'Staff' | 'Admin';
type UserStatus = 'Active' | 'Suspended' | 'Inactive';

interface UserRecord {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    joined: string;
    reservations: number;
    status: UserStatus;
}


function getInitial(name: string) {
    return name.charAt(0).toUpperCase();
}

function getRoleBadgeStyle(role: UserRole): React.CSSProperties {
    switch (role) {
        case 'Admin': return { background: 'var(--badge-admin-bg)', color: 'var(--badge-admin-color)', border: '1px solid var(--badge-admin-border)' };
        case 'Staff': return { background: 'var(--badge-staff-bg)', color: 'var(--badge-staff-color)', border: '1px solid var(--badge-staff-border)' };
        case 'Customer': return { background: 'var(--badge-customer-bg)', color: 'var(--badge-customer-color)', border: '1px solid var(--badge-customer-border)' };
    }
}

function getStatusBadgeStyle(status: UserStatus): React.CSSProperties {
    switch (status) {
        case 'Active': return { background: 'var(--badge-active-bg)', color: 'var(--badge-active-color)', border: '1px solid var(--badge-active-border)' };
        case 'Suspended': return { background: 'var(--badge-suspended-bg)', color: 'var(--badge-suspended-color)', border: '1px solid var(--badge-suspended-border)' };
        case 'Inactive': return { background: 'var(--badge-inactive-bg)', color: 'var(--badge-inactive-color)', border: '1px solid var(--badge-inactive-border)' };
    }
}


const IconSearch = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);
const IconX = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);


function UserModal({
    mode,
    user,
    onClose,
    onSave,
}: {
    mode: 'add' | 'edit';
    user?: UserRecord;
    onClose: () => void;
    onSave: (data: Partial<UserRecord>) => void;
}) {
    const [form, setForm] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        role: user?.role ?? 'Customer' as UserRole,
        status: user?.status ?? 'Active' as UserStatus,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('FORM BEING SUBMITTED:', form);

        onSave(form);
    };

    return (
        <div style={s.overlay} onClick={onClose}>
            <div style={s.modalBox} onClick={e => e.stopPropagation()}>
                <div style={s.modalHeader}>
                    <span style={s.modalTitle}>{mode === 'add' ? 'Add New User' : 'Edit User'}</span>
                    <button style={s.closeBtn} onClick={onClose}><IconX /></button>
                </div>
                <form onSubmit={handleSubmit} style={s.form}>
                    <label style={s.label}>Full Name</label>
                    <input style={s.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Maria Santos" />
                    <label style={s.label}>Email</label>
                    <input style={s.input} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="e.g. maria@email.ph" />
                    {mode === 'add' && (
                        <>
                            <label style={s.label}>Temporary Password</label>
                            <input style={s.input} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} placeholder="At least 8 characters" />
                        </>
                    )}
                    <label style={s.label}>Role</label>
                    <select style={s.input} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}>
                        <option value="Customer">Customer</option>
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <label style={s.label}>Status</label>
                    <select style={s.input} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as UserStatus }))}>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <div style={s.modalActions}>
                        <button type="button" style={s.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" style={s.primaryBtn}>{mode === 'add' ? 'Add User' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeleteModal({ user, onClose, onConfirm }: { user: UserRecord; onClose: () => void; onConfirm: () => void }) {
    return (
        <div style={s.overlay} onClick={onClose}>
            <div style={{ ...s.modalBox, maxWidth: 400 }} onClick={e => e.stopPropagation()}>
                <div style={s.modalHeader}>
                    <span style={s.modalTitle}>Delete User</span>
                    <button style={s.closeBtn} onClick={onClose}><IconX /></button>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: '16px 0', lineHeight: 1.6 }}>
                    Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                </p>
                <div style={s.modalActions}>
                    <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
                    <button style={{ ...s.primaryBtn, background: '#dc2626' }} onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}


export default function AdminUserAndStaff({ users: initialUsers }: { users: UserRecord[] }) {
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editUser, setEditUser] = useState<UserRecord | null>(null);
    const [deleteUser, setDeleteUser] = useState<UserRecord | null>(null);

    const filtered = initialUsers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = (data: Partial<UserRecord>) => {
        router.post('/users-staff', data, {
            preserveScroll: true,
            onSuccess: () => setShowAddModal(false),
        });
    };

    const handleEdit = (data: Partial<UserRecord>) => {
        if (!editUser) {
return;
}

        router.put(`/users-staff/${editUser.id}`, data, {
            preserveScroll: true,
            onSuccess: () => setEditUser(null),
        });
    };

    const handleDelete = () => {
        if (!deleteUser) {
return;
}

        router.delete(`/users-staff/${deleteUser.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteUser(null),
        });
    };

    return (
        <>
            <Head title="Users & Staff" />

            {/* Global Theme & Responsive Variables */}
            <style>{`
                :root {
                    --bg-card: #ffffff;
                    --bg-input: #fafafa;
                    --bg-modal: #ffffff;
                    --border-color: #e0e0e0;
                    --border-subtle: #f5f5f5;
                    --text-main: #1a1a1a;
                    --text-muted: #555555;
                    --text-subtle: #888888;
                    --text-header: #999999;
                    --primary-bg: #4a1030;
                    --primary-text: #ffffff;
                    --cancel-bg: #ffffff;
                    --cancel-border: #e0e0e0;
                    --cancel-text: #555555;
                    --shadow-color: rgba(0, 0, 0, 0.05);
                    --overlay-bg: rgba(0, 0, 0, 0.35);
                    --tr-border: #f8f8f8;

                    --badge-admin-bg: #fce4ec;
                    --badge-admin-color: #c62828;
                    --badge-admin-border: #f48fb1;

                    --badge-staff-bg: #fffde7;
                    --badge-staff-color: #9e7c00;
                    --badge-staff-border: #fff176;

                    --badge-customer-bg: #fce4ec;
                    --badge-customer-color: #880e4f;
                    --badge-customer-border: #f8bbd0;

                    --badge-active-bg: #e8f5e9;
                    --badge-active-color: #2e7d32;
                    --badge-active-border: #a5d6a7;

                    --badge-suspended-bg: #fce4ec;
                    --badge-suspended-color: #c62828;
                    --badge-suspended-border: #ef9a9a;

                    --badge-inactive-bg: #f5f5f5;
                    --badge-inactive-color: #757575;
                    --badge-inactive-border: #e0e0e0;
                }


                .dark {
                    --bg-card: #18181b;
                    --bg-input: #27272a;
                    --bg-modal: #18181b;
                    --border-color: #3f3f46;
                    --border-subtle: #27272a;
                    --text-main: #f4f4f5;
                    --text-muted: #d4d4d8;
                    --text-subtle: #a1a1aa;
                    --text-header: #71717a;
                    --primary-bg: #701a4a;
                    --primary-text: #ffffff;
                    --cancel-bg: #27272a;
                    --cancel-border: #3f3f46;
                    --cancel-text: #d4d4d8;
                    --shadow-color: rgba(0, 0, 0, 0.3);
                    --overlay-bg: rgba(0, 0, 0, 0.7);
                    --tr-border: #27272a;

                    --badge-admin-bg: rgba(198, 40, 40, 0.2);
                    --badge-admin-color: #ef5350;
                    --badge-admin-border: rgba(239, 83, 80, 0.4);

                    --badge-staff-bg: rgba(255, 235, 59, 0.15);
                    --badge-staff-color: #ffee58;
                    --badge-staff-border: rgba(255, 235, 59, 0.3);

                    --badge-customer-bg: rgba(248, 187, 208, 0.15);
                    --badge-customer-color: #f48fb1;
                    --badge-customer-border: rgba(248, 187, 208, 0.3);

                    --badge-active-bg: rgba(46, 125, 50, 0.25);
                    --badge-active-color: #81c784;
                    --badge-active-border: rgba(129, 199, 132, 0.4);

                    --badge-suspended-bg: rgba(198, 40, 40, 0.2);
                    --badge-suspended-color: #ef5350;
                    --badge-suspended-border: rgba(239, 83, 80, 0.4);

                    --badge-inactive-bg: rgba(255, 255, 255, 0.08);
                    --badge-inactive-color: #a1a1aa;
                    --badge-inactive-border: rgba(255, 255, 255, 0.15);
                }

                @media (max-width: 640px) {
                    .responsive-page {
                        padding: 16px !important;
                    }
                    .responsive-header {
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }
                    .responsive-actions {
                        width: 100% !important;
                        flex-direction: column !important;
                    }
                    .responsive-search-wrapper,
                    .responsive-search-input,
                    .responsive-add-btn {
                        width: 100% !important;
                    }
                    .responsive-add-btn {
                        text-align: center;
                    }
                }
            `}</style>

            <div style={s.page} className="responsive-page">
                {/* Header row */}
                <div style={s.headerRow} className="responsive-header">
                    <h1 ></h1>
                    <div style={s.headerActions} className="responsive-actions">
                        <div style={s.searchWrapper} className="responsive-search-wrapper">
                            <span style={s.searchIcon}><IconSearch /></span>
                            <input
                                id="users-search"
                                style={s.searchInput}
                                className="responsive-search-input"
                                placeholder="Search users..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button id="add-user-btn" style={s.addBtn} className="responsive-add-btn" onClick={() => setShowAddModal(true)}>
                            + Add User
                        </button>
                    </div>
                </div>

                {/* Table card */}
                <div style={s.tableCard}>
                    <div style={s.tableScrollContainer}>
                        <table style={s.table}>
                            <thead>
                                <tr>
                                    <th style={{ ...s.th, width: '30%' }}>USER</th>
                                    <th style={s.th}>ROLE</th>
                                    <th style={s.th}>JOINED</th>
                                    <th style={s.th}>RESERVATIONS</th>
                                    <th style={s.th}>STATUS</th>
                                    <th style={{ ...s.th, textAlign: 'right' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-subtle)' }}>
                                            No users found.
                                        </td>
                                    </tr>
                                ) : filtered.map((u, idx) => (
                                    <tr key={u.id} style={idx < filtered.length - 1 ? s.trBorder : {}}>
                                        <td style={s.td}>
                                            <div style={s.userCell}>
                                                <div style={s.avatar}>{getInitial(u.name)}</div>
                                                <div>
                                                    <div style={s.userName}>{u.name}</div>
                                                    <div style={s.userEmail}>{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={s.td}>
                                            <span style={{ ...s.badge, ...getRoleBadgeStyle(u.role) }}>{u.role}</span>
                                        </td>
                                        <td style={{ ...s.td, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{u.joined}</td>
                                        <td style={{ ...s.td, color: 'var(--text-main)', fontWeight: 600 }}>{u.reservations}</td>
                                        <td style={s.td}>
                                            <span style={{ ...s.badge, ...getStatusBadgeStyle(u.status) }}>{u.status}</span>
                                        </td>
                                        <td style={{ ...s.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            <button
                                                id={`edit-user-${u.id}`}
                                                style={s.iconBtn}
                                                title="Edit user"
                                                onClick={() => setEditUser(u)}
                                            >
                                                <IconEdit />
                                            </button>
                                            <button
                                                id={`delete-user-${u.id}`}
                                                style={{ ...s.iconBtn, color: '#ef5350' }}
                                                title="Delete user"
                                                onClick={() => setDeleteUser(u)}
                                            >
                                                <IconTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <UserModal mode="add" onClose={() => setShowAddModal(false)} onSave={handleAdd} />
            )}
            {editUser && (
                <UserModal mode="edit" user={editUser} onClose={() => setEditUser(null)} onSave={handleEdit} />
            )}
            {deleteUser && (
                <DeleteModal user={deleteUser} onClose={() => setDeleteUser(null)} onConfirm={handleDelete} />
            )}
        </>
    );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
    page: {
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        maxWidth: '100%',
        boxSizing: 'border-box',
    },
    headerRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
    },
    pageTitle: {
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: 26,
        fontWeight: 700,
        color: 'var(--text-main)',
        margin: 0,
        letterSpacing: '-0.3px',
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    searchWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        color: 'var(--text-subtle)',
        display: 'flex',
        alignItems: 'center',
    },
    searchInput: {
        padding: '9px 14px 9px 36px',
        borderRadius: 24,
        border: '1.5px solid var(--border-color)',
        fontSize: 14,
        color: 'var(--text-main)',
        background: 'var(--bg-card)',
        outline: 'none',
        width: 220,
        boxSizing: 'border-box',
    },
    addBtn: {
        padding: '9px 22px',
        borderRadius: 24,
        background: 'var(--primary-bg)',
        color: 'var(--primary-text)',
        fontWeight: 600,
        fontSize: 14,
        border: 'none',
        cursor: 'pointer',
        letterSpacing: '0.2px',
        whiteSpace: 'nowrap',
    },
    tableCard: {
        background: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        boxShadow: '0 1px 8px var(--shadow-color)',
        overflow: 'hidden',
    },
    tableScrollContainer: {
        width: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
    },
    table: {
        width: '100%',
        minWidth: 650,
        borderCollapse: 'collapse',
    },
    th: {
        padding: '14px 20px',
        textAlign: 'left',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--text-header)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        borderBottom: '1.5px solid var(--border-subtle)',
    },
    td: {
        padding: '18px 20px',
        fontSize: 14,
        color: 'var(--text-main)',
        verticalAlign: 'middle',
    },
    trBorder: {
        borderBottom: '1px solid var(--tr-border)',
    },
    userCell: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: 'var(--primary-bg)',
        color: 'var(--primary-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 15,
        flexShrink: 0,
    },
    userName: {
        fontWeight: 700,
        color: 'var(--text-main)',
        fontSize: 14,
        lineHeight: 1.3,
    },
    userEmail: {
        fontSize: 12,
        color: 'var(--text-subtle)',
        lineHeight: 1.3,
        marginTop: 1,
    },
    badge: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
    },
    iconBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-subtle)',
        padding: '4px 6px',
        borderRadius: 6,
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: 2,
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'var(--overlay-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)',
        padding: 16,
        boxSizing: 'border-box',
    },
    modalBox: {
        background: 'var(--bg-modal)',
        borderRadius: 16,
        padding: '24px 28px',
        width: '100%',
        maxWidth: 480,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 8px 40px var(--shadow-color)',
        border: '1px solid var(--border-color)',
        boxSizing: 'border-box',
    },
    modalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modalTitle: {
        fontWeight: 700,
        fontSize: 18,
        color: 'var(--text-main)',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: 4,
        borderRadius: 6,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text-muted)',
        marginBottom: -4,
    },
    input: {
        padding: '10px 14px',
        borderRadius: 10,
        border: '1.5px solid var(--border-color)',
        fontSize: 14,
        color: 'var(--text-main)',
        outline: 'none',
        background: 'var(--bg-input)',
        width: '100%',
        boxSizing: 'border-box',
    },
    modalActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 8,
    },
    cancelBtn: {
        padding: '9px 20px',
        borderRadius: 10,
        border: '1.5px solid var(--cancel-border)',
        background: 'var(--cancel-bg)',
        color: 'var(--cancel-text)',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
    },
    primaryBtn: {
        padding: '9px 22px',
        borderRadius: 10,
        border: 'none',
        background: 'var(--primary-bg)',
        color: 'var(--primary-text)',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
    },
};


AdminUserAndStaff.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Users & Staff',
                href: users(),
            },
        ]}
    >
        {page}
    </AppLayout>
);