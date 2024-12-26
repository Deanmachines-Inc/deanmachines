import { Link, useLocation } from '@remix-run/react';

interface BreadcrumbProps {
    readonly items: readonly { readonly href: string; readonly label: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbProps) {
    const location = useLocation();

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {items.map((item, index) => (
                    <li key={item.href} className="breadcrumb-item">
                        {index === items.length - 1 ? (
                            <span>{item.label}</span>
                        ) : (
                            <Link to={`${location.pathname}${item.href}`}>{item.label}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}