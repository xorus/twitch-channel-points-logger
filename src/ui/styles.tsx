import { styled } from "@stitches/react";

export const Button = styled('button', {
    backgroundColor: "var(--color-background-button-secondary-default)",
    color: "var(--color-text-button-secondary)",
    padding: 'var(--button-padding-y) var(--button-padding-x)',
    fontSize: 'var(--button-text-default)',
    borderRadius: 'var(--border-radius-medium)',
    fontWeight: 'var(--font-weight-semibold)',
    '&:hover': {
        backgroundColor: "var(--color-background-button-secondary-hover)",
    },
    '&:active': {
        backgroundColor: "var(--color-background-button-secondary-active)",
    }
})

export const ButtonPrimary = styled(Button, {
    backgroundColor: "var(--color-background-button-primary-default)",
    color: "var(--color-text-button-primary)",
    '&:hover': {
        backgroundColor: "var(--color-background-button-primary-hover)",
    },
    '&:active': {
        backgroundColor: "var(--color-background-button-primary-active)",
    }
})

export const InputLabel = styled('span', {
    fontWeight: 'var(--font-weight-semibold)',
});

export const InputText = styled('input', {
    fontFamily: 'inherit',
    appearance: 'none',
    backgroundClip: 'padding-box',
    lineHeight: 1.5,
    transition: 'border var(--timing-short) ease-in, background-color var(--timing-short) ease-in',
    borderStyle: 'solid',
    borderWidth: 'var(--border-width-input)',
    borderColor: 'var(--color-border-input)',
    color: 'var(--color-text-input)',
    backgroundColor: 'var(--color-background-input)',
    width: 'calc(100% - 4px)',
    height: 'var(--input-size-default)',
    fontSize: 'var(--input-text-default)',  
    borderRadius: 'var(--border-radius-medium)',
    paddingLeft: '2px',
    paddingRight: '2px',
    '&:hover': {
        outline: 'none',
        borderColor: 'var(--color-border-input-hover)',
        backgroundColor: 'var(--color-background-input)',
    },
    '&:focus': {
        outline: 'none',
        borderColor: 'var(--color-border-input-focus)',
        backgroundColor: 'var(--color-background-input-focus)',
    },
})